import {container, singleton} from "@fusion.io/bare";
import {HttpServiceProvider, KERNEL, get} from "../src/Http";
import {assert} from "chai";
import request from "request-promise-native";


@singleton()
class SimpleController {

    @get('/')
    async indexAction(context) {
        context.body = {
            hello: 'world'
        };
    }
}

describe('Test HttpServiceProvider is implemented properly', () => {
    const sp = new HttpServiceProvider(container);

    sp.register();
    sp.boot();

    it('can start the simple server', async () => {

        const kernel = container.resolve(KERNEL);

        kernel.listen(8080);

        const response = JSON.parse(await request('http://localhost:8080'));

        assert.deepEqual(response, {hello: 'world'});
    });
});
