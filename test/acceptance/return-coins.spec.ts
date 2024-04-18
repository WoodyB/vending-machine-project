import { determineProtocolDriver } from '../DSL/determineProtocolDriver';
import { Coins } from '../../src/types';
import { VM_STR_COIN_WAS_DISPENSED, VM_STR_INSERT_COIN } from '../../src/constants/vending-machine-strings'

jest.setTimeout(15000);

describe("Vending Machine", () => {
    const driver = determineProtocolDriver();

    beforeEach(async () => {
        await driver.setup();
    });

    afterEach(async () => {
        await driver.teardown();
    });

    it('should return a quarter, a dime and a nickel after they are inserted and coin return is activated', async () => {
        await driver.insertCoin(Coins.QUARTER);
        await driver.insertCoin(Coins.DIME);
        await driver.insertCoin(Coins.NICKEL);
        await driver.verifyDisplayOutput('0.40');
        await driver.returnCoins();
        const foundQuarter = await driver.verifyActionOutput(`${Coins.QUARTER} ${VM_STR_COIN_WAS_DISPENSED}`);
        expect(foundQuarter).toBe(true);
        const foundDime = await driver.verifyActionOutput(`${Coins.DIME} ${VM_STR_COIN_WAS_DISPENSED}`);
        expect(foundDime).toBe(true);
        const foundNickel = await driver.verifyActionOutput(`${Coins.NICKEL} ${VM_STR_COIN_WAS_DISPENSED}`);
        expect(foundNickel).toBe(true);
    });

    it(`should display ${VM_STR_INSERT_COIN} after a coin return is activated`, async () => {
        await driver.insertCoin(Coins.NICKEL);
        await driver.verifyDisplayOutput('0.05');
        await driver.returnCoins();
        await driver.verifyActionOutput(`${Coins.NICKEL} ${VM_STR_COIN_WAS_DISPENSED}`);
        const foundInsertCoin = await driver.verifyDisplayOutput(VM_STR_INSERT_COIN);
        expect(foundInsertCoin).toBe(true);
    });
});
