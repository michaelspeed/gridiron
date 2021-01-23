import { InjectableStrategy } from "@gridiron/gridiron-common";

export interface AssetsNamingStrategy extends InjectableStrategy {
    generateSourceFileName(originalFileName: string, conflictFileName?: string): string
    generatePreviewFileName(sourceFileName: string, conflictFileName?: string): string
}
