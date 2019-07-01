import {assert} from 'chai';
import SessionManager from "../src/Session/SessionManager";

describe('SessionManager tests', () => {

    let session;

    beforeEach(() => {
        session = new SessionManager();
    });

    it('can load the saved session data', () => {

        session.load([
            [ 'foo'  , {metadata: {}, payload: 'bar'}   ],
            [ 'hello', {metadata: {}, payload: 'world'} ]
        ]);

        assert.equal(session.get('foo'), 'bar');
        assert.equal(session.get('hello'), 'world');
    });

    it('can get the session data with a given factory method', () => {

        session.load([
            [ 'foo'  , {metadata: {}, payload: 'bar'}   ],
            [ 'hello', {metadata: {}, payload: 'world'} ]
        ]);

        assert.equal(session.get('foo', null, value => value + '--extra'), 'bar--extra');
    });

    it('can set the session data', () => {
        session.set('key1', 'value1');
        session.set('key2', 'value', value => value + 2);

        assert.equal(session.get('key1'), 'value1');
        assert.equal(session.get('key2'), 'value2');
    });

    it('can flash a session data', () => {
        session.flash('flashedKey', 'flashedValue');

        assert(session.has('flashedKey'));
        assert.equal(session.get('flashedKey'), 'flashedValue');
        assert.isFalse(session.has('flashedKey'));
    });

    it('only allow storing stringy session key', () => {
        assert.throw(() => {
            session.set({}, 'some value');
        }, 'E_SESSION: Key of the session must be a string');
    });

    it('only storing truthy value', () => {
        assert.throw(() => {
            session.set('some key', false);
        }, 'E_SESSION: Could not set falsy values: false, null, undefined, \'\', NaN');

        assert.throw(() => {
            session.set('some key', '');
        }, 'E_SESSION: Could not set falsy values: false, null, undefined, \'\', NaN');

        assert.throw(() => {
            session.set('some key', null);
        }, 'E_SESSION: Could not set falsy values: false, null, undefined, \'\', NaN');


        assert.throw(() => {
            session.set('some key', undefined);
        }, 'E_SESSION: Could not set falsy values: false, null, undefined, \'\', NaN');

        assert.throw(() => {
            session.set('some key', NaN);
        }, 'E_SESSION: Could not set falsy values: false, null, undefined, \'\', NaN');
    });

    it('can store falsy - like values: 0, [], {}', () => {
        session.set('zero', 0);
        session.set('emptyArray', []);
        session.set('emptyObject', {});

        assert.equal(session.get('zero'), 0);

        assert.isArray(session.get('emptyArray'));
        assert.strictEqual(session.get('emptyArray').length, 0);

        assert.isObject(session.get('emptyObject'));
        assert.deepEqual(session.get('emptyObject'), {});
    });

    it('can serialize and load the data back', () => {
        session.set('foo', {message: "bar"});

        const serialized = session.serialize();

        let otherSession = new SessionManager();

        otherSession.load(serialized);

        assert.deepEqual(otherSession.get('foo'), {message: 'bar'})
    });

    it('can unset a session data', () => {
        session.set('foo', 'bar');

        assert(session.has('foo'));

        session.unset('foo');

        assert.isFalse(session.has('foo'));
    });

    it('can clear the session data', () => {
        session.set('foo', 'bar');

        assert(session.size);

        session.forget();

        assert.equal(session.size, 0);
    })
});
