import {DynamicModule, Inject, Module, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import {PluginLifecycleMethods} from './gridiron-plugin';
import {ConfigModule, ConfigService, Logger} from '../config';
import {getPluginModules, getWorkerControllers, hasLifecycleMethods, isDynamicModule} from './plugin-metadata';
import {getConfig} from '../config/config-helpers';

export enum PluginProcessContext {
    Main,
    Worker,
}

const PLUGIN_PROCESS_CONTEXT = 'GRIDIRON_PLUGIN_PROCESS_CONTEXT';

@Module({
    imports: [ConfigModule]
})
export class PluginModule implements OnModuleInit, OnModuleDestroy {

    static forRoot(): DynamicModule {
        return {
            module: PluginModule,
            providers: [{provide: PLUGIN_PROCESS_CONTEXT, useValue: PluginProcessContext.Main}],
            imports: [...getConfig().plugins]
        }
    }

    static forWorker(): DynamicModule {
        return {
            module: PluginModule,
            providers: [{provide: PLUGIN_PROCESS_CONTEXT, useValue: PluginProcessContext.Worker}],
            imports: [...pluginsWithWorkerController()]
        }
    }

    constructor(
        @Inject(PLUGIN_PROCESS_CONTEXT) private processContext: PluginProcessContext,
        private moduleRef: ModuleRef,
        private configService: ConfigService
    ) {
    }

    async onModuleDestroy() {
        Logger.info('[Plugin Module] destroying now')
        if (this.processContext === PluginProcessContext.Main) {
            await this.runPluginLifecycleMethods('onGridironClose')
        }
        if (this.processContext === PluginProcessContext.Worker) {
            await this.runPluginLifecycleMethods('onGridironWorkerClose')
        }
    }

    async onModuleInit() {
        Logger.info('[Plugin Module] initializing')
        if (this.processContext === PluginProcessContext.Main) {
            await this.runPluginLifecycleMethods('onGridironBootstrap', instance => {
                const pluginName = instance.constructor.name || '(anonymous plugin)';
                Logger.verbose(`Bootstrapped plugin ${pluginName}`)
            })
        }
        if (this.processContext === PluginProcessContext.Worker) {
            await this.runPluginLifecycleMethods('onGridironWorkerBootstrap')
        }
    }

    private async runPluginLifecycleMethods(
        lifecycleMethods: keyof PluginLifecycleMethods,
        afterRun?: (instance: any) => void
    ) {
        for (const plugin of getPluginModules(this.configService.plugins)) {
            let instance: any;
            try {
                instance = this.moduleRef.get(plugin, {strict: false})
            } catch (e) {
                Logger.error(`Could not find ${plugin.name}`, undefined, e.stack)
            }
            if (instance) {
                if (hasLifecycleMethods(instance, lifecycleMethods)) {
                    await instance[lifecycleMethods]()
                }
                if (typeof afterRun === 'function') {
                    afterRun(instance)
                }
            }
        }
    }
}

function pluginsWithWorkerController(): DynamicModule[] {
    return getConfig().plugins.map(plugin => {
        const controllers = getWorkerControllers(plugin)
        if (isDynamicModule(plugin)) {
            return {
                ...plugin,
                controllers
            }
        } else {
            return {
                module: plugin,
                controllers
            }
        }
    })
}
