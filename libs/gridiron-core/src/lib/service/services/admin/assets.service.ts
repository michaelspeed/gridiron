import {Injectable} from '@nestjs/common';
import {ConfigService, Logger} from '../../../config';
import {CreateAssetInput, UpdateAssetInput} from '../../../api/dto/admin/admin-types';
import {Asset} from '../../../entity';
import {Stream} from 'stream';
import {AssetType, getAssetType, ID, ListQueryOptions, PaginatedList} from '../../../common';
import path from 'path';
import {InjectConnection} from '@nestjs/typeorm';
import {Connection, Like} from 'typeorm';
import {EventBus} from '../../../event-bus';
import {AssetEvent} from '@gridiron/core/event-bus/events/asset-event';
import {GetEntityOrThrow} from '../../helpers/utils/get-entity-throw';
import {patchEntity} from '../../helpers/utils/patch-entity';
import {FileUpload} from 'graphql-upload';
import {ListQueryBuilder} from '../../helpers/list-query-builder/list-query-builder';

const sizeOf = require('image-size');

@Injectable()
export class AssetsService {
    constructor(
        @InjectConnection() private connection: Connection,
        private configService: ConfigService,
        private eventBus: EventBus,
        private listQueryBuilder: ListQueryBuilder
    ) {}

    async create(input: FileUpload): Promise<Asset> {
        const { createReadStream, filename, mimetype } = await input
        console.log(filename, mimetype)
        const stream = createReadStream()
        const asset = await this.createAssetInternal(stream, filename, mimetype)
        this.eventBus.publish(new AssetEvent(asset, 'created'))
        return asset
    }

    findOne(id: ID): Promise<Asset | undefined> {
        return this.connection.getRepository(Asset).findOne(id)
    }

    findByFileName(fileName: string, exact: boolean = true): Promise<Asset | undefined> {
        const source = exact ? fileName : Like(path.basename(fileName, path.extname(fileName)) + '%')
        return this.connection.getRepository(Asset).findOne({
            where: {
                source
            }
        })
    }

    findAll(options?: ListQueryOptions<Asset>): Promise<PaginatedList<Asset>> {
        return this.listQueryBuilder
            .build(Asset, options)
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems
            }))
    }

    findAllSimple(): Promise<Asset[]> {
        return this.connection.getRepository(Asset).find({order: {createdAt: 'DESC'}})
    }

    async update(input: UpdateAssetInput): Promise<Asset> {
        const asset = await GetEntityOrThrow(this.connection, Asset, input.id)
        if (input.focalPoint) {
            const to3dp = (x: number) => +x.toFixed(3)
            input.focalPoint.x = to3dp(input.focalPoint.x)
            input.focalPoint.y = to3dp(input.focalPoint.y)
        }
        patchEntity(asset, input)
        const updatedAsset = await this.connection.getRepository(Asset).save(asset)
        this.eventBus.publish(new AssetEvent(updatedAsset, 'updated'))
        return updatedAsset
    }

    private async createAssetInternal(stream: Stream, filename: string, mimeType: string): Promise<Asset> {
        const {assetOptions} = this.configService
        const {assetPreviewStrategy, assetStorageStrategy} = assetOptions
        const sourceFileName = await this.generateSourceFileName(filename)
        const previewFileName = await this.generatePreviewFileName(sourceFileName)

        const sourceFileIdentifier = await assetStorageStrategy.writeFileFromStream(sourceFileName, stream)
        const sourceFile = await assetStorageStrategy.readFileToBuffer(sourceFileIdentifier)
        let preview: Buffer
        try {
            preview = await assetPreviewStrategy.generatePreviewImage(mimeType, sourceFile)
        } catch (e) {
            Logger.error(`Could not create Asset preview image: ${e.message}`);
            throw e
        }
        const previewFileIdentifier = await assetStorageStrategy.writeFileFromBuffer(
            previewFileName,
            preview
        )
        const type = getAssetType(mimeType)
        const { width, height } = this.getDimensions(type === AssetType.IMAGE ? sourceFile : preview)
        const asset = new Asset({
            type,
            width,
            height,
            name: path.basename(sourceFileName),
            fileSize: sourceFile.byteLength,
            mimeType: mimeType,
            source: sourceFileIdentifier,
            preview: previewFileIdentifier
        })
        return this.connection.manager.save(asset)
    }

    private async generateSourceFileName(fileName: string): Promise<string> {
        const {assetOptions} = this.configService
        return this.generateUnique(fileName, (name, conflict) =>
            assetOptions.assetNamingStrategy.generateSourceFileName(name, conflict)
        )
    }

    private async generatePreviewFileName(filename: string): Promise<string> {
        const {assetOptions} = this.configService
        return this.generateUnique(filename, (name, conflict) =>
            assetOptions.assetNamingStrategy.generatePreviewFileName(name, conflict)
        )
    }

    private getDimensions(imageFile: Buffer): { width: number; height: number } {
        try {
            const { width, height } = sizeOf(imageFile);
            return { width, height };
        } catch (e) {
            Logger.error(`Could not determine Asset dimensions: ` + e);
            return { width: 0, height: 0 };
        }
    }

    private async generateUnique(
        inputFileName: string,
        generateFileNameFn: (filename: string, conflictName?: string) => string
    ): Promise<string> {
        const {assetOptions} = this.configService
        let outputName: string | undefined
        do {
            outputName = generateFileNameFn(inputFileName, outputName)
        } while (await assetOptions.assetStorageStrategy.fileExist(outputName))
        return outputName
    }
}
