import {AssetsNamingStrategy, AssetsStorageStrategy} from '@gridiron/core';

export type ImageTransformMode = 'crop' | 'resize';

export interface ImageTransformPreset {
    name: string;
    width: number;
    height: number;
    mode: ImageTransformMode;
}

export interface AssetServerOptions {
    hostname?: string
    port: number
    route: string
    assetUploadDir: string
    assetUrlPrefix?: string
    previewMaxWidth?: number
    previewMaxHeight?: number
    presets?: ImageTransformPreset[]
    namingStrategy?: AssetsNamingStrategy
    storageStrategyFactory?: (
        options: AssetServerOptions
    ) => AssetsStorageStrategy | Promise<AssetsStorageStrategy>
}
