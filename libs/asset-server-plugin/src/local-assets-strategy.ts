import {Stream} from 'stream';
import fs from 'fs-extra';
import path from 'path';
import {Request} from 'express';
import {AssetsStorageStrategy} from '@gridiron/core';

export class LocalAssetsStrategy implements AssetsStorageStrategy {
    toAbsoluteUrl:((request: Request, identifier: string) => string) | undefined

    constructor(
        private readonly uploadPath: string,
        private readonly toAbsoluteUrlFn?: (request: Request, identifier: string) => string
    ) {
        fs.ensureDirSync(this.uploadPath)
        if (toAbsoluteUrlFn) {
            this.toAbsoluteUrl = toAbsoluteUrlFn
        }
    }

    deleteFile(identifier: string): Promise<void> {
        return fs.unlink(this.identifierToFilePath(identifier))
    }

    fileExist(fileName: string): Promise<boolean> {
        return new Promise(resolve => {
            fs.access(this.identifierToFilePath(fileName), fs.constants.F_OK, err => {
                resolve(!err)
            })
        })
    }

    readFileToBuffer(identifier: string): Promise<Buffer> {
        return fs.readFile(this.identifierToFilePath(identifier))
    }

    readFileToStream(identifier: string): Promise<Stream> {
        const readStream = fs.createReadStream(this.identifierToFilePath(identifier), 'binary')
        return Promise.resolve(readStream)
    }

    async writeFileFromBuffer(fileName: string, data: Buffer): Promise<string> {
        const filePath = path.join(this.uploadPath, fileName)
        await fs.ensureDir(path.dirname(filePath))
        await fs.writeFile(filePath, data, 'binary')
        return this.filePathToIdentifier(filePath)
    }

    async writeFileFromStream(fileName: string, data: Stream): Promise<string> {
        const filePath = path.join(this.uploadPath, fileName)
        await fs.ensureDir(path.dirname(filePath))
        const writeStream = fs.createWriteStream(filePath, 'binary')
        return new Promise<string>((resolve, reject) => {
            data.pipe(writeStream)
            writeStream.on('close', () => resolve(this.filePathToIdentifier(filePath)))
            writeStream.on('error', reject)
        })
    }

    private filePathToIdentifier(filePath: string): string {
        const filePathDirname = path.dirname(filePath)
        const deltaDirname = filePathDirname.replace(this.uploadPath, '')
        const identifier = path.join(deltaDirname, path.basename(filePath))
        return identifier.replace(/^[\\/]+/, '')
    }

    private identifierToFilePath(identifier: string): string {
        return path.join(this.uploadPath, identifier)
    }

}
