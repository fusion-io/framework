import {EventEmitter} from "events";

const MIGRATING = 'MIGRATING';
const MIGRATED  = 'MIGRATED';

export default class MigrationSet {

    constructor(defineds = []) {
        this.defineds  = defineds;
        this.executeds = [];
        this.event     = new EventEmitter();
    }

    setState(executeds) {
        this.executeds = executeds;
    }

    defines() {
        return this.defineds;
    }

    getExecution(name) {
        return this.executeds.find(executed => executed.migration === name);
    }

    async up(step, connection) {
        let notRunYet = this.notMigrated();
        let executing = [];

        if (step > notRunYet.length) {
            step = notRunYet.length;
        }

        for (let index = 0; index < step; index++) {
            const {name, migration} = notRunYet[index];

            const instance = new migration.default();

            this.event.emit(MIGRATING, name, 'up');

            await instance.up(connection.schema);

            this.event.emit(MIGRATED, name, 'up');

            executing.push({migration: name, runAt: Date.now()})
        }

        return executing;
    }

    upTo(version, connection) {
        let notRunYet   = this.notMigrated();
        let targetIndex = notRunYet.findIndex(migration => migration.name === version);

        return this.up(targetIndex + 1, connection);
    }

    latest(connection) {
        let notRunYet   = this.notMigrated();

        return this.up(notRunYet.length, connection);
    }

    async down(step, connection) {
        let alreadyRun = this.hasBeenMigrated().map(v => v).reverse();
        let executing   = [];

        if (step > alreadyRun.length) {
            step = alreadyRun.length;
        }

        for (let index = 0; index < step; index++) {
            const {name, migration} = alreadyRun[index];

            const instance = new migration.default();

            this.event.emit(MIGRATING, name, 'down');

            await instance.down(connection.schema);

            this.event.emit(MIGRATED, name, 'down');

            executing.push(this.getExecution(name));
        }

        return executing;
    }

    downTo(version, connection) {
        let alreadyRun = this.hasBeenMigrated().map(v => v).reverse();
        let targetIndex = alreadyRun.findIndex(migration => migration.name === version);

        return this.down(targetIndex + 1, connection);

    }

    reset(connection) {
        let alreadyRun = this.hasBeenMigrated().map(v => v).reverse();
        return this.down(alreadyRun.length, connection)
    }

    notMigrated() {
        return this.defineds.filter(m => !this.getExecution(m.name));
    }

    hasBeenMigrated() {
        return this.defineds.filter(m => this.getExecution(m.name));
    }

    migrating(callback) {
        this.event.on(MIGRATING, callback);
        return this;
    }

    migrated(callback) {
        this.event.on(MIGRATED, callback);
        return this;
    }
};
