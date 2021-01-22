import {Stream} from 'stream';
import {Request} from 'express';
import {AssetsStorageStrategy} from './assets-storage-strategy';
import {InternalServerError} from '../../common';

const errorMessage = 'error.no-asset-storage-strategy-configured';

export class NoAssetsStorageStrategy implements AssetsStorageStrategy {
    deleteFile(identifier: string): Promise<void> {
        throw new InternalServerError(errorMessage);
    }

    fileExist(fileName: string): Promise<boolean> {
        throw new InternalServerError(errorMessage);
    }

    readFileToBuffer(identifier: string): Promise<Buffer> {
        throw new InternalServerError(errorMessage);
    }

    readFileToStream(identifier: string): Promise<Stream> {
        throw new InternalServerError(errorMessage);
    }

    toAbsoluteUrl(request: Request, identifier: string): string {
        throw new InternalServerError(errorMessage);
    }

    writeFileFromBuffer(fileName: string, data: Buffer): Promise<string> {
        throw new InternalServerError(errorMessage);
    }

    writeFileFromStream(fileName: string, data: Stream): Promise<string> {
        throw new InternalServerError(errorMessage);
    }
}
