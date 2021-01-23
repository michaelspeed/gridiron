import {AssetsStorageStrategy} from "@gridiron/core";
import {Stream} from "stream";
import {Request} from 'express'
import {Bucket, Storage} from '@google-cloud/storage'
import getRawBody from 'raw-body';
import {AssetServerOptions} from "./types";

export type GoogleBucketCredentials = {
    keyFilename?: string,
    projectId: string,
    credentials?: any
}

export interface GoogleBucketConfig {
    credentials: GoogleBucketCredentials,
    bucket: string
}

export function configureGoogleCloudStorage(bucketConfig: GoogleBucketConfig) {
    return (options: AssetServerOptions) => {
        const {assetUrlPrefix, route} = options
        const toAbsoluteUrlFn = (request: Request, identifier: string): string => {
            if (!identifier) {
                return '';
            }
            const prefix = assetUrlPrefix || `${request.protocol}://${request.get('host')}/${route}/`;
            return identifier.startsWith(prefix) ? identifier : `${prefix}${identifier}`;
        };
        return new GoogleStorageStrategy(bucketConfig, toAbsoluteUrlFn)
    }
}


export class GoogleStorageStrategy implements AssetsStorageStrategy {
    toAbsoluteUrl:((request: Request, identifier: string) => string) | undefined

    private googleBucket: Bucket

    constructor(
        private googleBucketConfig: GoogleBucketConfig,
        public readonly toAbsoluteUrlFn?: (request: Request, identifier: string) => string,
    ) {
    }

    async init() {
        if (!this.googleBucket) {
            const storage = new Storage({credentials: this.getCredentials().credentials.credentials})
            this.googleBucket = storage.bucket(this.getCredentials().bucket)
        }
    }

    private getCredentials() {
        return this.googleBucketConfig
    }

    destroy(): void | Promise<void> {
        return undefined;
    }

    async deleteFile(identifier: string): Promise<void> {
        await this.init()
        const file = await this.googleBucket.file(identifier).get()
        await file[0].delete()
        return
    }

    async fileExist(fileName: string): Promise<boolean> {
        await this.init()
        return new Promise<boolean>(async (resolve, reject) => {
            const file = await this.googleBucket.file(fileName)
            file.exists().then(() => {
                resolve(true)
            }).catch(() => resolve(false))
        })
    }

    async readFileToBuffer(identifier: string): Promise<Buffer> {
        await this.init()
        const file = await this.googleBucket.file(identifier).get()
        return await getRawBody(file[0].createReadStream())
    }

    async readFileToStream(identifier: string): Promise<Stream> {
        await this.init()
        const file = await this.googleBucket.file(identifier).get()
        return file[0].createReadStream()
    }

    async writeFileFromBuffer(fileName: string, data: Buffer): Promise<string> {
        console.log('buffer')
        await this.init()
        const file = this.googleBucket.file(fileName)
        const saved = await file.save(file)
        const filedata = await file.get()
        return filedata[0].name;
    }

    async writeFileFromStream(fileName: string, data: Stream): Promise<string> {
        console.log('stream')
        await this.init()
        const file = this.googleBucket.file(fileName)
        const filestream = file.createWriteStream({resumable: false})
        return new Promise((resolve, reject) => {
            filestream.on('finish', () => {
                resolve(file.name)
            })
            filestream.on("error", reject)
        })
    }


}
