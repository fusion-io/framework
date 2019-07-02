import ServiceProvider from "../utils/ServiceProvider";
import {Config, Kernel, Router} from "../Contracts";
import lodash from 'lodash';
import HttpResolver from "./HttpResolver";
import "./UrlManager";

/**
 * Provide the Http Kernel & Http Router  configuration & behaviors
 *
 */
export default class HttpServiceProvider extends ServiceProvider {

    /**
     * The middleware groups.
     * It will helps us to work more efficient when applying middlewares by unit of logic
     *
     * @return {{}}
     */
    middlewareGroups() {
        return {

        }
    }

    /**
     * The list of global middleware that will be used
     *
     * @return {Array}
     */
    globalMiddlewares() {
        return [

        ]
    }

    /**
     * List of available controllers
     *
     * @return {Array}
     */
    routeGroups() {
        return [

        ]
    }

    /**
     * Register all of the middleware group
     *
     */
    register() {
        lodash.forIn(this.middlewareGroups(), (middlewares, groupName) => {
            this.container.value(HttpResolver.makeKeyNameForMiddlewareGroup(groupName), middlewares);
        });
    }

    /**
     * Bootstrap the HttpKernel
     *
     * @return {*|void}
     */
    bootstrapKernel() {
        const kernel    = this.container.make(Kernel);
        const config    = this.container.make(Config);
        const resolver  = this.container.make(HttpResolver);

        kernel.keys = config.get('keys', []);

        // Apply global middlewares to the Kernel
        resolver.resolveMiddleware(this.globalMiddlewares())
            .forEach(middleware => kernel.use(middleware))
        ;

        return kernel;
    }

    /**
     * Bootstrap the router(s).
     *
     * @return {*|void}
     */
    bootstrapRoutes() {
        const config    = this.container.make(Config);
        const resolver  = this.container.make(HttpResolver);
        const router    = this.container.make(Router);

        this.controllers()
            .map(Controller => resolver.resolveController(Controller))
            .forEach(routeDefinitions => {

                const overridePathMap = config.get('http.url.pathMap', {});
                const replace         = config.get('http.url.replace');

                routeDefinitions.override(overridePathMap, replace);

                routeDefinitions.apply(router);
            })
        ;

        return router;
    }

    /**
     * @inheritDoc
     */
    boot() {
        const kernel = this.bootstrapKernel();
        const router = this.bootstrapRoutes();

        kernel.use(router.routes());
        kernel.use(router.allowedMethods());
    }
}
