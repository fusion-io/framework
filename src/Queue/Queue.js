import Manager from "../utils/Manager";
import SyncQueueDriver from "./SyncQueueDriver";
import lodash from "lodash";

export default class Queue extends Manager {

    constructor(registry) {
        super();
        this.registry = registry;
        this.drivers  = {
            "sync": SyncQueueDriver
        }
    }

    getDefaultAdapterName() {
        return "sync";
    }

    resolveDriver(adapterName) {
        return "sync";
    }

    queue(queueName = null) {
        return this.adapter(queueName);
    }

    enqueue(job, payload = null, queue = null) {

        let jobName = job;

        // This one is a job class
        if(lodash.isFunction(job.execute) && lodash.isFunction(job.toPayload)) {
            jobName = job.constructor.name;
            payload = job.toPayload();
        }

        if (!this.registry.has(jobName)) {
            throw new Error(`E_QUEUE: Could not enqueue job named [${jobName}]. ` +
                `The job's workload is not registered to the registry.`
            );
        }

        return this.queue(queue).dispatch({jobName, payload});
    }
}
