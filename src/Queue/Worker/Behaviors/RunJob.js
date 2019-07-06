export default class RunJob {
    constructor(job) {
        this.job = job;
    }

    async execute() {
        await this.job.execute();
    }
}
