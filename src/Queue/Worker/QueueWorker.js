export default class QueueWorker {
    constructor(registry) {
        this.registry  = registry;
        this.behaviors = [ ];
    }

    async work({jobName, payload}) {
        const workload = this.registry.get(jobName);

        await workload(payload);

        await new Promise(resolve => setTimeout(resolve, 500));
    };
}
