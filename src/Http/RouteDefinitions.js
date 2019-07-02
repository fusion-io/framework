/**
 * The route definition list. Normally it's a result of a HttpResolver.resolveController()
 */
export default class RouteDefinitions {

    /**
     *
     * @param definitions
     */
    constructor(definitions = []) {
        this.definitions = definitions;
        this.pathMap     = {};
        this.replace     = false;
    }

    /**
     * Get the overridden url of a definition
     *
     * @param definition
     * @return {*}
     */
    overriddenOf(definition) {
        const {url, name} = definition;

        if (this.pathMap[url]) {
            return this.pathMap[url];
        }

        if (this.pathMap[name]) {
            return this.pathMap[name];
        }

        return null;
    }

    /**
     * Override routes by a given pathMap.
     * This method will be useful for changing routes in one place (like SEO).
     *
     * @param {{string, string}} pathMap   The list of url or routeName which will be overridden
     * @param {boolean} replace   Indicate whether the overridden urls should replace the existing route or not.
     *                  If false, it will keep both of the url, with the origin url will have the ".original" postfix
     */
    override(pathMap, replace = false) {
        this.pathMap = pathMap;
        this.replace = replace;
        return this;
    }

    /**
     * Apply the route definitions.
     *
     * @param router
     */
    apply(router) {
        this.definitions.forEach(definition => {
            const {method, url, name, handler, middlewares } = definition;

            const overridden = this.overriddenOf(definition);

            // If current route definition is not overridden, we'll set the route normally
            if (!overridden) {
                return router[method](name, url, ...middlewares, handler);
            }

            // Otherwise, we'll set the router with the overridden path
            router[method](name, overridden, ...middlewares, handler);

            // If the replace flag is not set, we'll still set the route based on definition
            if (!this.replace) {
                router[method](`${name}.original`, url, ...middlewares, handler);
            }
        });
    }
}
