import { determineProtocolDriver } from '../DSL/determineProtocolDriver';
import { Coins } from '../../src/types'
import {VM_STR_INSERT_COIN } from '../../src/constants/vending-machine-strings'

describe("Vending Machine", () => {
    const driver = determineProtocolDriver();

    beforeEach(async () => {
        await driver.setup();
    });

    afterEach(async () => {
        await driver.teardown();
    });

    it(`should display ${VM_STR_INSERT_COIN}`, async () => {
        const foundInsertCoin = await driver.verifyDisplayOutput(VM_STR_INSERT_COIN);
        expect(foundInsertCoin).toBe(true);
    });

    it("should accept a quarter and display its value", async () => {
        await driver.insertCoin(Coins.QUARTER);
        const foundDisplay25Cents = await driver.verifyDisplayOutput('0.25');
        expect(foundDisplay25Cents).toBe(true);
    });

    it("should accept a dime and display its value", async () => {
        await driver.insertCoin(Coins.DIME);
        const foundDisplay10Cents = await driver.verifyDisplayOutput('0.10');
        expect(foundDisplay10Cents).toBe(true);
    });

    it("should accept a nickel and display its value", async () => {
        await driver.insertCoin(Coins.NICKEL);
        const foundDisplay5Cents = await driver.verifyDisplayOutput('0.05');
        expect(foundDisplay5Cents).toBe(true);
    });

    it("should accept a quarter, a dime and a nickel and display 40 cents ", async () => {
        await driver.insertCoin(Coins.QUARTER);
        await driver.insertCoin(Coins.DIME);
        await driver.insertCoin(Coins.NICKEL);
        const foundDisplay5Cents = await driver.verifyDisplayOutput('0.40');
        expect(foundDisplay5Cents).toBe(true);
    });
});
