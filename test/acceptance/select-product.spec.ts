import { determineProtocolDriver } from '../DSL/determineProtocolDriver';
import { Coins, Products } from '../../src/types';
import {
    VM_STR_THANK_YOU,
    VM_STR_PRODUCT_DISPENSED,
    VM_STR_PRICE
} from '../../src/constants/vending-machine-strings'

jest.setTimeout(15000);

describe("Vending Machine", () => {
    const driver = determineProtocolDriver();

    beforeEach(async () => {
        await driver.setup();
    });

    afterEach(async () => {
        await driver.teardown();
    });

    it(`should dispense ${Products.COLA } after inserting four quarters and selecting ${Products.COLA }`, async () => {
        await driver.insertCoin(Coins.QUARTER);
        await driver.insertCoin(Coins.QUARTER);
        await driver.insertCoin(Coins.QUARTER);
        await driver.insertCoin(Coins.QUARTER);
        await driver.selectProduct(Products.COLA);
        const foundProductDispensedAction = await driver.verifyActionOutput(`${Products.COLA} ${VM_STR_PRODUCT_DISPENSED}`);
        expect(foundProductDispensedAction).toBe(true);
        const foundThankYouMessage = await driver.verifyDisplayOutput(VM_STR_THANK_YOU);
        expect(foundThankYouMessage).toBe(true);
    });

    it(`should dispense ${Products.COLA } after inserting 10 dimes and selecting ${Products.COLA }`, async () => {
        await driver.insertCoin(Coins.DIME);
        await driver.insertCoin(Coins.DIME);
        await driver.insertCoin(Coins.DIME);
        await driver.insertCoin(Coins.DIME);
        await driver.insertCoin(Coins.DIME);
        await driver.insertCoin(Coins.DIME);
        await driver.insertCoin(Coins.DIME);
        await driver.insertCoin(Coins.DIME);
        await driver.insertCoin(Coins.DIME);
        await driver.insertCoin(Coins.DIME);
        await driver.selectProduct(Products.COLA);
        const foundProductDispensedAction = await driver.verifyActionOutput(`${Products.COLA} ${VM_STR_PRODUCT_DISPENSED}`);
        expect(foundProductDispensedAction).toBe(true);
        const foundThankYouMessage = await driver.verifyDisplayOutput(VM_STR_THANK_YOU);
        expect(foundThankYouMessage).toBe(true);
    });

    it(`should dispense ${Products.CANDY } after inserting 2 quarters, 1 dime and 1 nickel and selecting ${Products.CANDY }`, async () => {
        await driver.insertCoin(Coins.QUARTER);
        await driver.insertCoin(Coins.QUARTER);
        await driver.insertCoin(Coins.DIME);
        await driver.insertCoin(Coins.NICKEL);
        await driver.selectProduct(Products.CANDY);
        
        const foundProductDispensedAction = await driver.verifyActionOutput(`${Products.CANDY} ${VM_STR_PRODUCT_DISPENSED}`);
        expect(foundProductDispensedAction).toBe(true);
        const foundThankYouMessage = await driver.verifyDisplayOutput(VM_STR_THANK_YOU);
        expect(foundThankYouMessage).toBe(true);
    });

    it(`should dispense ${Products.CHIPS } after inserting 2 quarters and selecting ${Products.CHIPS }`, async () => {
        await driver.insertCoin(Coins.QUARTER);
        await driver.insertCoin(Coins.QUARTER);
        await driver.selectProduct(Products.CHIPS);
        const foundProductDispensedAction = await driver.verifyActionOutput(`${Products.CHIPS} ${VM_STR_PRODUCT_DISPENSED}`);
        expect(foundProductDispensedAction).toBe(true);
        const foundThankYouMessage = await driver.verifyDisplayOutput(VM_STR_THANK_YOU);
        expect(foundThankYouMessage).toBe(true);
    });

    it(`should display ${VM_STR_PRICE} 0.50 after inserting 1 quarter and selecting ${Products.CHIPS }`, async () => {
        await driver.insertCoin(Coins.QUARTER);
        await driver.selectProduct(Products.CHIPS);
        const foundPriceMessage = await driver.verifyDisplayOutput(`${VM_STR_PRICE} 0.50`);
        expect(foundPriceMessage).toBe(true);
    });
});