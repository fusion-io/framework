import {Queue as QueueInterface} from "../Contracts";
import ServiceProvider from "../utils/ServiceProvider";
import QueueRegistry from "./QueueRegistry";
import Queue from "./Queue";

export default class QueueServiceProvider extends ServiceProvider {
    register() {
        this.container.value(QueueRegistry, new QueueRegistry());
        this.container.singleton(QueueInterface, (container) => {
            return new Queue(container.make(QueueRegistry));
        });
    }
}
