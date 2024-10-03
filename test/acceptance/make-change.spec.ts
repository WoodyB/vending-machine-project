import { determineProtocolDriver } from '../DSL/determineProtocolDriver';
import { Coins, Products } from '../../src/types';
import {
    VM_STR_THANK_YOU,
    VM_STR_PRODUCT_DISPENSED,
    VM_STR_COIN_WAS_DISPENSED
} from '../../src/constants/vending-machine-strings'

describe("Vending Machine", () => {
    const driver = determineProtocolDriver();

    beforeAll(() => {
        console.log(`TEST SCRIPT: ${expect.getState().testPath}`);
    });

    beforeEach(async () => {
        console.log(`TEST CASE: ${expect.getState().currentTestName}`);
        await driver.setup();
    });

    afterEach(async () => {
        await driver.teardown();
        console.log('END TEST CASE\n');
    });

    it('Should return 10 cents change after inserting three quarters and a 65 cents product is purchased', async () => {
        await driver.insertCoin(Coins.QUARTER);
        await driver.insertCoin(Coins.QUARTER);
        await driver.insertCoin(Coins.QUARTER);
        await driver.selectProduct(Products.CANDY);
        await driver.verifyActionOutput(`${Products.CANDY} ${VM_STR_PRODUCT_DISPENSED}`);        
        await driver.verifyDisplayOutput(VM_STR_THANK_YOU);
        const foundActionChangeDispensed = await driver.verifyActionOutput(`${Coins.DIME} ${VM_STR_COIN_WAS_DISPENSED}`);
        expect(foundActionChangeDispensed).toBe(true);
    });

    it('Should return 25 cents change after inserting three quarters and a 50 cents product is purchased', async () => {
        await driver.insertCoin(Coins.QUARTER);
        await driver.insertCoin(Coins.QUARTER);
        await driver.insertCoin(Coins.QUARTER);
        await driver.selectProduct(Products.CHIPS);
        await driver.verifyActionOutput(`${Products.CHIPS} ${VM_STR_PRODUCT_DISPENSED}`);        
        await driver.verifyDisplayOutput(VM_STR_THANK_YOU);
        const foundActionChangeDispensed = await driver.verifyActionOutput(`${Coins.QUARTER} ${VM_STR_COIN_WAS_DISPENSED}`);
        expect(foundActionChangeDispensed).toBe(true);
    });

    it('Should return 10 cents change after inserting twelve nickels and a 50 cents product is purchased', async () => {
        await driver.insertCoin(Coins.NICKEL);
        await driver.insertCoin(Coins.NICKEL);
        await driver.insertCoin(Coins.NICKEL);
        await driver.insertCoin(Coins.NICKEL);
        await driver.insertCoin(Coins.NICKEL);
        await driver.insertCoin(Coins.NICKEL);
        await driver.insertCoin(Coins.NICKEL);
        await driver.insertCoin(Coins.NICKEL);
        await driver.insertCoin(Coins.NICKEL);
        await driver.insertCoin(Coins.NICKEL);
        await driver.insertCoin(Coins.NICKEL);
        await driver.insertCoin(Coins.NICKEL);
        await driver.selectProduct(Products.CHIPS);
        await driver.verifyActionOutput(`${Products.CHIPS} ${VM_STR_PRODUCT_DISPENSED}`);        
        await driver.verifyDisplayOutput(VM_STR_THANK_YOU);
        const foundActionChangeDispensed = await driver.verifyActionOutput(`${Coins.DIME} ${VM_STR_COIN_WAS_DISPENSED}`);
        expect(foundActionChangeDispensed).toBe(true);
    });
});
