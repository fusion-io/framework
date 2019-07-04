import {assert} from "chai";
import MemoryStorage from "../src/Storage/MemoryStorage";
import DatabaseStorage from "../src/Storage/DatabaseStorage";
import knex from "knex";

const connection = knex({
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: __dirname + "/testdb.sqlite"
    }
});

const driverGenericTestCases = (driver) => {
    beforeEach(async () => {
        if (driver.flush) {
            await driver.flush();
        }
    });

    /**
     * Basic get/set tests
     */
    it('can set and get an item', async () => {
        await driver.store('foo', 'bar');

        assert.deepEqual(await driver.get('foo'), {key: 'foo', value: 'bar'});
    });

    it('can remove an item', async () => {
        await driver.store('foo', 'bar');

        assert(await driver.get('foo'));

        await driver.remove('foo');

        assert.isNull(await driver.get('foo'));
    });

    it('can flush a cache', async () => {
        await driver.store('foo', 'bar');
        await driver.store('far', 'boo');

        assert(await driver.get('foo'));
        assert(await driver.get('far'));

        await driver.flush();

        assert.isNull(await driver.get('foo'));
        assert.isNull(await driver.get('far'));
    });
};

const driverTaggableTestCases = (driver) => {
    /**
     * Taggable tests
     */
    it('can store an item with tag', async () => {
        await driver.store('foo', 'bar', {tags: 'tag'});
        await driver.store('hello', 'world', {tags: 'tag'});

        const results = await driver.getByTag('tag');

        assert.equal(results.length, 2);

        const [item1, item2] = results;

        assert(item1.key === 'foo' || item1.key === 'hello');
        assert(item2.key === 'foo' || item2.key === 'hello');

    });
};


describe('Storage tests', () => {
    describe('Drivers tests', () => {

        describe('MemoryStorage test cases', () => {
            const driver = new MemoryStorage();
            driverGenericTestCases(driver);
            driverTaggableTestCases(driver);
        });

        describe('DatabaseStorage test cases', () => {
            before(async () => {
                await connection.schema.dropTableIfExists('storage');
                await connection.schema.createTable('storage', table => {
                    table.increments();
                    table.string('key');
                    table.string('value');
                    table.string('tags');
                    table.integer('expiredAt');
                })
            });

            after(async () => {
                await connection.schema.dropTable('storage');
            });

            beforeEach(async () => {
                await connection.truncate('storage');
            });


            const driver = new DatabaseStorage(connection);

            driverGenericTestCases(driver);
            driverTaggableTestCases(driver);
        });

    });
});
