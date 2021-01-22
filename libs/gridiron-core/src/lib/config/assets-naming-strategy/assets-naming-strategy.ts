import {InjectableStrategy} from '../../common';

export interface AssetsNamingStrategy extends InjectableStrategy {
    generateSourceFileName(originalFileName: string, conflictFileName?: string): string
    generatePreviewFileName(sourceFileName: string, conflictFileName?: string): string
}
