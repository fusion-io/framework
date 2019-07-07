import ServiceProvider from "../utils/ServiceProvider";
import {Config, I18N} from "../Contracts";
import i18next from 'i18next';
import SyncBackend from 'i18next-sync-fs-backend';

export default class I18NextServiceProvider extends ServiceProvider {

    register() {
        this.container.singleton(I18N, container => {
            const config = container.make(Config);
            const instance = i18next.createInstance();

            instance.use(SyncBackend).init({...config.get('i18n'), initImmediate: false});

            return instance;
        });
    }
}
