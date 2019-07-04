import {assert} from "chai";
import MemoryStorage from "../Storage/MemoryStorage";



describe('Storage tests', () => {
    describe('Driver tests', () => {

        let testingDrivers = [
            new MemoryStorage()
        ];

        testingDrivers.forEach(driver => {
            beforeEach(async () => {
                if (driver.flush) {
                    await driver.flush();
                }
            });

            describe(`${driver.constructor.name} tests`, () => {

                /**
                 * Basic get/set tests
                 */
                it('can set and get an item', async () => {
                    await driver.store('foo', 'bar');

                    assert.equal(await driver.get('foo'), 'bar');
                });

                it('can remove an item', async () => {
                    await driver.store('foo', 'bar');

                    assert(await driver.get('foo'));

                    await driver.remove('foo');

                    assert.isNull(await driver.get('foo'));
                });

                /**
                 * Taggable tests
                 */
                if (driver.getByTag) {
                    it('can store an item with tag', async () => {
                        await driver.store('foo', 'bar', {tags: 'tag'});
                        await driver.store('hello', 'world', {tags: 'tag'});

                        assert.deepEqual(driver.getByTag('tag'), ['bar', 'world']);
                    });
                }
            });
        });
    });
});
