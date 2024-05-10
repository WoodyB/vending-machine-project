import { determineProtocolDriver } from '../DSL/determineProtocolDriver';
import { Coins, Products } from '../../src/types';
import {
    VM_STR_THANK_YOU,
    VM_STR_PRODUCT_DISPENSED,
    VM_STR_PRICE,
    VM_STR_SOLD_OUT,
    VM_STR_INSERT_COIN
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

    it(`should display ${VM_STR_SOLD_OUT} when ${Products.COLA} is out of stock and product is selected`, async () => {
        await driver.simulateProductEmptyEvent(Products.COLA);
        await driver.selectProduct(Products.COLA);
        const foundSoldOutMessage = await driver.verifyDisplayOutput(`${VM_STR_SOLD_OUT}`);
        expect(foundSoldOutMessage).toBe(true);
    });

    it(`should display ${VM_STR_SOLD_OUT} when ${Products.CANDY} is out of stock and product is selected`, async () => {
        await driver.simulateProductEmptyEvent(Products.CANDY);
        await driver.selectProduct(Products.CANDY);
        const foundSoldOutMessage = await driver.verifyDisplayOutput(`${VM_STR_SOLD_OUT}`);
        expect(foundSoldOutMessage).toBe(true);
    });

    it(`should display ${VM_STR_SOLD_OUT} when ${Products.CHIPS} is out of stock and product is selected`, async () => {
        await driver.simulateProductEmptyEvent(Products.CHIPS);
        await driver.selectProduct(Products.CHIPS);
        const foundSoldOutMessage = await driver.verifyDisplayOutput(`${VM_STR_SOLD_OUT}`);
        expect(foundSoldOutMessage).toBe(true);
    });

    it(`should display ${VM_STR_INSERT_COIN} after ${VM_STR_SOLD_OUT} when product is selected and no coins inserted`, async () => {
        await driver.simulateProductEmptyEvent(Products.CHIPS);
        await driver.selectProduct(Products.CHIPS);
        const foundSoldOutMessage = await driver.verifyDisplayOutput(`${VM_STR_SOLD_OUT}`);
        if (!foundSoldOutMessage) {
            throw new Error(`Cannot continue test because "${VM_STR_SOLD_OUT} was not found`);
        }
        driver.clearSavedDisplayOutputMessages();
        const foundInsertCoinMessage = await driver.verifyDisplayOutput(`${VM_STR_INSERT_COIN}`);
        expect(foundInsertCoinMessage).toBe(true);
    });

    it(`should display amount entered after ${VM_STR_SOLD_OUT} when product is selected and coins have been inserted`, async () => {
        await driver.simulateProductEmptyEvent(Products.COLA);
        await driver.insertCoin(Coins.QUARTER);
        await driver.insertCoin(Coins.QUARTER);
        await driver.insertCoin(Coins.QUARTER);
        await driver.insertCoin(Coins.QUARTER);
        await driver.selectProduct(Products.COLA);
        const foundSoldOutMessage = await driver.verifyDisplayOutput(`${VM_STR_SOLD_OUT}`);
        if (!foundSoldOutMessage) {
            throw new Error(`Cannot continue test because "${VM_STR_SOLD_OUT} was not found`);
        }
        driver.clearSavedDisplayOutputMessages();
        const foundDisplay100Cents = await driver.verifyDisplayOutput('1.00');
        expect(foundDisplay100Cents).toBe(true);
    });
});
