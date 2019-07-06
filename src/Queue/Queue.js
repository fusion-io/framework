import Manager from "../utils/Manager";

export default class Queue extends Manager {

    getDefaultAdapterName() {
        return "";
    }

    resolveDriver(adapterName) {
        return "";
    }

    queue(queueName = null) {
        return this.adapter(queueName);
    }

    enqueue(job, queue = null) {
        return this.adapter(queue).enqueue(job);
    }
}
