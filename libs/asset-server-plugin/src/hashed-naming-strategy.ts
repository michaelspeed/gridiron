import path from 'path';
import {createHash} from 'crypto';
import {DefaultAssetsNamingStrategy} from '@gridiron/core';

export class HashedNamingStrategy extends DefaultAssetsNamingStrategy {

    generatePreviewFileName(sourceFileName: string, conflictFileName?: string): string {
        const fileName = super.generatePreviewFileName(sourceFileName, conflictFileName)
        return path.join('preview', this.getHashedDir(fileName), fileName)
    }

    generateSourceFileName(originalFileName: string, conflictFileName?: string): string {
        const fileName = super.generateSourceFileName(originalFileName, conflictFileName)
        return path.join('source', this.getHashedDir(fileName), fileName)
    }

    private getHashedDir(fileName: string): string {
        return createHash('md5')
            .update(fileName)
            .digest('hex')
            .slice(0,2)
    }
}
