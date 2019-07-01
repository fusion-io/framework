import ServiceProvider from "@fusion.io/bare/utils/ServiceProvider";
import {Config} from "@fusion.io/bare";

export const ROUTER     = "Http.Router";
export const KERNEL     = "Http.Kernel";
export const REGISTRY   = "Http.RouteRegistry";

export default class HttpServiceProvider extends ServiceProvider {

    register() {

    }

    bootstrapKernel() {
        const kernel = this.container.resolve(KERNEL);
        const config = this.container.resolve(Config);

        kernel.keys = config.get('keys', []);

        return this.container.resolve('Http.Kernel');
    }

    bootstrapRoutes() {
        const router    = this.container.resolve(ROUTER);
        const registry  = this.container.resolve(REGISTRY);

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
