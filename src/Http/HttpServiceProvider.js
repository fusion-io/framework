import ServiceProvider from "../utils/ServiceProvider";
import {Config, Kernel, Registry, Router} from "../Contracts";

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
        const kernel = this.container.make(Kernel);
        const config = this.container.make(Config);

        kernel.keys = config.get('keys', []);

        return kernel;
    }

    bootstrapRoutes() {
        const router    = this.container.make(Router);
        const registry  = this.container.make(Registry);

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
