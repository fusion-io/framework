import Manager from "../utils/Manager";

export default class StorageManager extends Manager {

    constructor() {
        super();

        this.drivers = {
            "file": () => {

            },

            "database": () => {

            },

            "memory": () => {

            },

            "blackhole": () => {

            },

            "": () => {

            }
        }
    }


    getDefaultAdapterName() {
        return "";
    }

    resolveDriver(adapterName) {
        return "";
    }
}
