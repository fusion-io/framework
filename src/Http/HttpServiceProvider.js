import ServiceProvider from "../utils/ServiceProvider";
import {Config, Kernel, Router} from "../Contracts";
import lodash from 'lodash';
import HttpResolver from "./HttpResolver";

/**
 * Provide the Http Kernel & Http Router  configuration & behaviors
 *
 */
export default class HttpServiceProvider extends ServiceProvider {

    /**
     * List of available controllers
     *
     * @return {Array}
     */
    controllers() {
        return [

        ]
    }

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
     * Bootstrap the router
     *
     * @return {*|void}
     */
    bootstrapRoutes() {
        const resolver          = this.container.make(HttpResolver);
        const routeDefinitions  = lodash.flatten(
            this.controllers()
                .map(Controller => resolver.resolveController(Controller))
        );

        const router = this.container.make(Router);

        routeDefinitions.forEach(routeDefinition => {
            const {method, url, handler, middlewares } = routeDefinition;

            router[method](url, ...middlewares, handler);
        });

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
