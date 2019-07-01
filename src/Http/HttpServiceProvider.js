import ServiceProvider from "../index";
import {Config} from "../index";

export const ROUTER     = "Http.Router";
export const KERNEL     = "Http.Kernel";
export const REGISTRY   = "Http.RouteRegistry";

export default class HttpServiceProvider extends ServiceProvider {

    /**
     * All of the Kernel handlers
     *
     * @return {Array}
     */
    get handlers() {
        return [

        ]
    }

    get routeGroups() {
        return {
            "api": [

            ],
            "web": [

            ]
        }
    }

    get globalHandlers() {
        return [

        ]
    }

    register() {

    }

    bootstrapKernel() {
        const kernel = this.container.make(KERNEL);
        const config = this.container.make(Config);

        kernel.keys = config.get('keys', []);

        return this.container.resolve('Http.Kernel');
    }

    bootstrapRoutes() {
        const router    = this.container.make(ROUTER);
        const registry  = this.container.make(REGISTRY);

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
