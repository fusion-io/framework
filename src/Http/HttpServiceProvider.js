import ServiceProvider from "@fusion.io/bare/utils/ServiceProvider";

export const ROUTER     = "Http.Router";
export const KERNEL     = "Http.Kernel";
export const REGISTRY   = "Http.RouteRegistry";

export default class HttpServiceProvider extends ServiceProvider {

    register() {

    }

    bootstrapKernel() {
        return this.container.resolve('Http.Kernel');
    }

    bootstrapRoutes() {
        const router    = this.container.resolve('Http.Router');
        const registry  = this.container.resolve('Http.RouteRegistry');

        registry.applyRoutes(router);

        return router;
    }

    boot() {
        const kernel = this.bootstrapKernel();
        const router = this.bootstrapRoutes();

        kernel.use(router.routes());
        kernel.use(router.allowedMethods());
    }
}
