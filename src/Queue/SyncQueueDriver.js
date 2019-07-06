export default class SyncQueueDriver {
    async enqueue(job) {
        await job.work();
    }
}

