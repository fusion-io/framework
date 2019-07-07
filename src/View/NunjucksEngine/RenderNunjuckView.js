import ViewEngineNunjucks from "./ViewEngineNunjucks";
import {singleton} from "@fusion.io/container";

@singleton(ViewEngineNunjucks)
export default class RenderNunjuckView {

    constructor(engine) {
        this.engine = engine;
    }

    async handle(context, next) {
        await next();
        context.type = 'html';
        context.body = this.engine.render(context.fusionView);
    }
}
