import {DNSHealthIndicator, TerminusModule} from '@nestjs/terminus';
import {Server} from 'http';
import path from 'path';
import {createHash} from 'crypto';
import express, {NextFunction, Request, Response} from 'express';
import { fromBuffer } from 'file-type';
import fs from 'fs-extra';
import {AssetServerOptions, ImageTransformPreset} from './types';
import {defaultAssetStorageStrategyFactory} from './default-storage-strategy-factory';
import {SharpAssetPreviewStrategy} from './SharpAssetPreviewStrategy';
import {HashedNamingStrategy} from './hashed-naming-strategy';
import {loggerCtx} from './constants';
import {transformImage} from './transform-image';
import {
    AssetsStorageStrategy, createProxyHandler,
    GridironPlugin,
    HealthCheckRegistryService, Logger,
    OnGridironBootstrap,
    OnGridironClose,
    PluginCommonModule, RuntimeGridIronConfig, Type
} from '@gridiron/core';


@GridironPlugin({
    imports: [PluginCommonModule, TerminusModule],
    configuration: config => AssetsServerPlugin.configure(config)
})
export class AssetsServerPlugin implements OnGridironBootstrap, OnGridironClose {
    private server: Server
    private static assetStorage: AssetsStorageStrategy
    private readonly cacheDir = 'cache'
    private presets: ImageTransformPreset[] = [
        { name: 'tiny', width: 50, height: 50, mode: 'crop' },
        { name: 'thumb', width: 150, height: 150, mode: 'crop' },
        { name: 'small', width: 300, height: 300, mode: 'resize' },
        { name: 'medium', width: 500, height: 500, mode: 'resize' },
        { name: 'large', width: 800, height: 800, mode: 'resize' },
    ];
    private static options: AssetServerOptions;

    constructor(
       private healthCheckRegistryService: HealthCheckRegistryService,
       private dns: DNSHealthIndicator
    ) {}

    static init(options: AssetServerOptions): Type<AssetsServerPlugin> {
        AssetsServerPlugin.options = options
        return this;
    }

    static async configure(config: RuntimeGridIronConfig) {
        Logger.info('[Asset Server Plugin] Initializing')
        const storageStrategyFactory = this.options.storageStrategyFactory || defaultAssetStorageStrategyFactory
        this.assetStorage = await storageStrategyFactory(this.options)
        config.assetOptions.assetPreviewStrategy = new SharpAssetPreviewStrategy({
            maxWidth: this.options.previewMaxWidth || 1600,
            maxHeight: this.options.previewMaxHeight || 1600
        })
        config.assetOptions.assetStorageStrategy = this.assetStorage
        config.assetOptions.assetNamingStrategy =
            this.options.namingStrategy || new HashedNamingStrategy()
        config.apiOptions.middleware.push({
            handler: createProxyHandler({...this.options, label: 'Asset Server Plugin'}),
            route: this.options.route
        })
        return config;
    }

    onGridironBootstrap(): void | Promise<void> {
        if (AssetsServerPlugin.options.presets) {
            for (const preset of AssetsServerPlugin.options.presets) {
                const existingIndex = this.presets.findIndex(p => p.name === preset.name)
                if (-1 < existingIndex) {
                    this.presets.splice(existingIndex, 1, preset)
                } else {
                    this.presets.push(preset)
                }
            }
        }

        const cachePath = path.join(AssetsServerPlugin.options.assetUploadDir, this.cacheDir)
        fs.ensureDirSync(cachePath)
        this.createAssetServer()
        const {hostname, port} = AssetsServerPlugin.options
    }

    onGridironClose(): void | Promise<void> {
        return new Promise(resolve => {
            this.server.close(() => resolve())
        })
    }

    private createAssetServer() {
        const assetServer = express();
        assetServer.get('/health', (req, res) => {
            res.send('ok');
        });
        assetServer.use(this.sendAsset(), this.generateTransformedImage());

        this.server = assetServer.listen(AssetsServerPlugin.options.port, () => {
            const addressInfo = this.server.address();
            if (addressInfo && typeof addressInfo !== 'string') {
                const { address, port } = addressInfo;
                Logger.info(`Asset server listening on "http://localhost:${port}"`, loggerCtx);
                this.healthCheckRegistryService.registerIndicatorFunction(() =>
                    this.dns.pingCheck('asset-server', `http://localhost:${port}/health`),
                );
            }
        });
    }

    private sendAsset() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const key = this.getFileNameFromRequest(req);
            try {
                const file = await AssetsServerPlugin.assetStorage.readFileToBuffer(key);
                let mimeType = this.getMimeType(key);
                if (!mimeType) {
                    mimeType = (await fromBuffer(file))?.mime || 'application/octet-stream';
                }
                res.contentType(mimeType);
                res.send(file);
            } catch (e) {
                const err = new Error('File not found');
                (err as any).status = 404;
                return next(err);
            }
        };
    }

    private generateTransformedImage() {
        return async (err: any, req: any, res: Response, next: NextFunction) => {
            if (err && (err.status === 404 || err.statusCode === 404)) {
                if (req.query) {
                    Logger.debug(`Pre-cached Asset not found: ${req.path}`, loggerCtx);
                    let file: Buffer;
                    try {
                        AssetsServerPlugin.assetStorage.readFileToBuffer(req.path)
                            .then(value => {
                                console.log(value)
                                file = value
                            })
                            .catch(err => console.log(err))
                        /*file = await AssetsServerPlugin.assetStorage.readFileToBuffer(req.path);*/
                    } catch (err) {
                        res.status(404).send('Resource not found');
                        return;
                    }
                    const image = await transformImage(file, req.query, this.presets || []);
                    try {
                        const imageBuffer = await image.toBuffer();
                        if (!req.query.cache || req.query.cache === 'true') {
                            const cachedFileName = this.getFileNameFromRequest(req);
                            await AssetsServerPlugin.assetStorage.writeFileFromBuffer(
                                cachedFileName,
                                imageBuffer,
                            );
                            Logger.debug(`Saved cached asset: ${cachedFileName}`, loggerCtx);
                        }
                        res.set('Content-Type', `image/${(await image.metadata()).format}`);
                        res.send(imageBuffer);
                    } catch (e) {
                        Logger.error(e, 'AssetServerPlugin', e.stack);
                        res.status(500).send(e.message);
                    }
                }
            }
            next();
        };
    }

    private getFileNameFromRequest(req: Request): string {
        const { w, h, mode, preset, fpx, fpy } = req.query;
        const focalPoint = fpx && fpy ? `_fpx${fpx}_fpy${fpy}` : '';
        let imageParamHash: string | null = null;
        if (w || h) {
            const width = w || '';
            const height = h || '';
            imageParamHash = this.md5(`_transform_w${width}_h${height}_m${mode}${focalPoint}`);
        } else if (preset) {
            if (this.presets && !!this.presets.find(p => p.name === preset)) {
                imageParamHash = this.md5(`_transform_pre_${preset}${focalPoint}`);
            }
        }
        if (imageParamHash) {
            return path.join(this.cacheDir, this.addSuffix(req.path, imageParamHash));
        } else {
            return req.path;
        }
    }

    private md5(input: string): string {
        return createHash('md5')
            .update(input)
            .digest('hex');
    }

    private addSuffix(fileName: string, suffix: string): string {
        const ext = path.extname(fileName);
        const baseName = path.basename(fileName, ext);
        const dirName = path.dirname(fileName);
        return path.join(dirName, `${baseName}${suffix}${ext}`);
    }

    private getMimeType(fileName: string): string | undefined {
        const ext = path.extname(fileName);
        switch (ext) {
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'png':
                return 'image/png';
            case 'gif':
                return 'image/gif';
            case 'svg':
                return 'image/svg+xml';
            case 'tiff':
                return 'image/tiff';
            case 'webp':
                return 'image/webp';
        }
    }
}
