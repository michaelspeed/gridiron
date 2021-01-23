import { InternalServerError } from '@gridiron/gridiron-common';
import {AssetsPreviewStrategy} from './assets-preview-strategy';

export class NoAssetsPreviewStrategy implements AssetsPreviewStrategy {
    generatePreviewImage(mimeType: string, data: Buffer): Promise<Buffer> {
        throw new InternalServerError('error.no-asset-preview-strategy-configured');
    }
}
