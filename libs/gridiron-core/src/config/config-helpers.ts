import {PartialGridironConfig, RuntimeGridIronConfig} from './GridIronConfig';
import {defaultConfig} from './default-config';
import {mergeConfig} from './merge-config';

let activeConfig = defaultConfig;

export async function setConfig(userConfig?: PartialGridironConfig) {
    activeConfig = await mergeConfig(activeConfig, userConfig)
}

export function getConfig(): Readonly<RuntimeGridIronConfig> {
    return activeConfig
}
