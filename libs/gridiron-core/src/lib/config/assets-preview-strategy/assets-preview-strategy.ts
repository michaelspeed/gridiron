import {InjectableStrategy} from '../../common';

export interface AssetsPreviewStrategy extends InjectableStrategy {
    generatePreviewImage(mimeType: string, data: Buffer): Promise<Buffer>
}
