import SessionManager from "./SessionManager";

export default async (context, next) => {

    // Extract the session payload

    let serializedPayload = context.session['fusionSession'] || [];
    let sessionManager    = new SessionManager();

    sessionManager.load(serializedPayload);

    context.session.set = (...parameters) => {
        return sessionManager.set(...parameters);
    };

    context.session.get = (...parameters) => {
        return sessionManager.get(...parameters);
    };

    context.session.unset = (...parameters) => {
        return sessionManager.unset(...parameters);
    };

    context.session.forget = () => {
        return sessionManager.forget();
    };

    context.session.flash = (...parameters) => {
        return sessionManager.flash(...parameters);
    };

    await next();

    context.session['fusionSession'] = sessionManager.serialize();
}