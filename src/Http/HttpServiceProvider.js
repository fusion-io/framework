import ServiceProvider from "../utils/ServiceProvider";
import {Config, Kernel, Router, Url} from "../Contracts";
import lodash from 'lodash';
import HttpResolver from "./HttpResolver";
import KoaRouter from "koa-router";
import Koa from "koa";
import UrlManager from "./UrlManager";

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
        return { }
    }

    /**
     * The list of global middleware that will be used
     *
     * @return {Array}
     */
    globalMiddlewares() {
        return []
    }

    /**
     * List of available controllers
     *
     * @return {{}}
     */
    routeGroups() {
        return [];
    }

    /**
     * Register the http services
     *
     */
    register() {
        this.container.value(Kernel, new Koa());
        this.container.value(Router, new KoaRouter());

        this.container.singleton(Url, (container) => {
            return new UrlManager(container.make(Router));
        });

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
        resolver
            .resolveMiddleware(this.globalMiddlewares())
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
        const router    = this.container.make(Router);

        lodash.forEach(this.routeGroups(), routeGroup => {
            const groupRouter = new KoaRouter({prefix: routeGroup.prefix || ''});

            this.bootstrapRouteGroup(routeGroup, groupRouter);

            router.use(groupRouter.routes());
        });

        return router;
    }

    /**
     *
     * @param middlewares
     * @param controllers
     * @param groupRouter
     */
    bootstrapRouteGroup({middlewares = [], controllers = []}, groupRouter) {
        const resolver        = this.container.make(HttpResolver);

        groupRouter.use(resolver.resolveMiddleware(middlewares));

        controllers
            .map(Controller => resolver.resolveController(Controller))
            .forEach(routeDefinitions => {
                routeDefinitions.apply(groupRouter);
            })
        ;
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
