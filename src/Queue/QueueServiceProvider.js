import {Config, Queue as QueueInterface} from "../Contracts";
import ServiceProvider from "../utils/ServiceProvider";
import QueueRegistry from "./QueueRegistry";
import Queue from "./Queue";
import QueueWorker from "./Worker/QueueWorker";

export default class QueueServiceProvider extends ServiceProvider {
    register() {

        this.container.value(QueueRegistry, new QueueRegistry());

        this.container.singleton(QueueInterface, (container) => {
            const config = container.make(Config);

            return new Queue(container.make(QueueRegistry), config.get('queue'));
        });

        this.container.singleton(QueueWorker, container => {
            return new QueueWorker(container.make(QueueRegistry))
        })
    }
}
