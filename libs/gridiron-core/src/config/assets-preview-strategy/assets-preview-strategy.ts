import { InjectableStrategy } from "@gridiron/gridiron-common";
export interface AssetsPreviewStrategy extends InjectableStrategy {
    generatePreviewImage(mimeType: string, data: Buffer): Promise<Buffer>
}
