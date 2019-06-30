import HttpServiceProvider, {KERNEL, ROUTER, REGISTRY} from "./HttpServiceProvider";
import RouteRegistry from "./RouteRegistry";

export const registry = new RouteRegistry();

export const route = (
    method,
    url,
    middlewares = [],
    actionDependencies = []
) => (
    Target,
    actionMethod
) => {
    const middlewareHandlers = middlewares.map(Middleware => registry.createControllerActionHandler(Middleware));
    const controllerHandler  = registry.createControllerActionHandler(Target.constructor, actionMethod, actionDependencies);

    registry.register(method.toLowerCase(), url, [ ...middlewareHandlers, controllerHandler]);
};

export const get    = (url, middlewares = [], actionDepedencies = []) => route('get', url, middlewares, actionDepedencies);
export const post   = (url, middlewares = [], actionDepedencies = []) => route('post', url, middlewares, actionDepedencies);
export const del    = (url, middlewares = [], actionDepedencies = []) => route('del', url, middlewares, actionDepedencies);
export const put    = (url, middlewares = [], actionDepedencies = []) => route('put', url, middlewares, actionDepedencies);
export const patch  = (url, middlewares = [], actionDepedencies = []) => route('patch', url, middlewares, actionDepedencies);
export const any    = (url, middlewares = [], actionDepedencies = []) => route('any', url, middlewares, actionDepedencies);

export {
    HttpServiceProvider,
    KERNEL,
    ROUTER,
    REGISTRY
};
