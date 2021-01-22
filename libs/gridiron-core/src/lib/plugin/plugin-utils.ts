import {RequestHandler} from 'express';
import {createProxyMiddleware} from 'http-proxy-middleware';
import {Logger, RuntimeGridIronConfig} from '../config';

export function createProxyHandler(options: ProxyOptions): RequestHandler {
    const route = options.route.charAt(0) === '/' ? options.route : '/' + options.route;
    const proxyHostname = options.hostname || 'localhost';
    const middleware = createProxyMiddleware({
        // TODO: how do we detect https?
        target: `http://${proxyHostname}:${options.port}`,
        pathRewrite: {
            [`^${route}`]: `/` + (options.basePath || ''),
        },
        logLevel: "silent",
        logProvider(provider) {
            return {
                log(message: string) {
                    Logger.debug(message, options.label);
                },
                debug(message: string) {
                    Logger.debug(message, options.label);
                },
                info(message: string) {
                    Logger.debug(message, options.label);
                },
                warn(message: string) {
                    Logger.warn(message, options.label);
                },
                error(message: string) {
                    Logger.error(message, options.label);
                },
            };
        },
    });
    // Attach the options to the middleware function to allow
    // the info to be logged after bootstrap.
    (middleware as any).proxyMiddleware = options;
    return middleware;
}

export interface ProxyOptions {
    /**
     * @description
     * A human-readable label for the service which is being proxied. Used to
     * generate more informative logs.
     */
    label: string;
    /**
     * @description
     * The route of the Vendure server which will act as the proxy url.
     */
    route: string;
    /**
     * @description
     * The port on which the service being proxied is running.
     */
    port: number;
    /**
     * @description
     * The hostname of the server on which the service being proxied is running.
     *
     * @default 'localhost'
     */
    hostname?: string;
    /**
     * @description
     * An optional base path on the proxied server.
     */
    basePath?: string;
}

/*
export function getProxyMiddlewareCliGreetings(config: RuntimeGridIronConfig): Array<[string, string]> {
    const output: Array<[string, string]> = [];
    for (const middleware of config.apiOptions.middleware || []) {
        if ((middleware.handler as any).proxyMiddleware) {
            const { port, hostname, label, route, basePath } = (middleware.handler as any)
                .proxyMiddleware as ProxyOptions;
            output.push([
                label,
                `http://${config.apiOptions.hostname || 'localhost'}:${
                    config.apiOptions.port
                }/${route}/ -> http://${hostname || 'localhost'}:${port}${basePath ? `/${basePath}` : ''}`,
            ]);
        }
    }
    return output;
}
*/

