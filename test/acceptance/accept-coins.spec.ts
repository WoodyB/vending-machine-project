import { determineProtocolDriver } from '../DSL/determineProtocolDriver';
import { Coins, Products } from '../../src/types';
import {
    VM_STR_INSERT_COIN,
    VM_STR_COIN_REJECTED,
    VM_STR_THANK_YOU,
    VM_STR_PRODUCT_DISPENSED
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

    it(`should display ${VM_STR_INSERT_COIN}`, async () => {
        const foundInsertCoin = await driver.verifyDisplayOutput(VM_STR_INSERT_COIN);
        expect(foundInsertCoin).toBe(true);
    });

    it('should accept a quarter and display its value', async () => {
        await driver.insertCoin(Coins.QUARTER);
        const foundDisplay25Cents = await driver.verifyDisplayOutput('0.25');
        expect(foundDisplay25Cents).toBe(true);
    });

    it('should accept a dime and display its value', async () => {
        await driver.insertCoin(Coins.DIME);
        const foundDisplay10Cents = await driver.verifyDisplayOutput('0.10');
        expect(foundDisplay10Cents).toBe(true);
    });

    it('should accept a nickel and display its value', async () => {
        await driver.insertCoin(Coins.NICKEL);
        const foundDisplay5Cents = await driver.verifyDisplayOutput('0.05');
        expect(foundDisplay5Cents).toBe(true);
    });

    it('should accept a quarter, a dime and a nickel and display 40 cents', async () => {
        await driver.insertCoin(Coins.QUARTER);
        await driver.insertCoin(Coins.DIME);
        await driver.insertCoin(Coins.NICKEL);
        const foundDisplay40Cents = await driver.verifyDisplayOutput('0.40');
        expect(foundDisplay40Cents).toBe(true);
    });

    it('Should report a PENNY was rejected', async () => {
        await driver.insertCoin(Coins.PENNY);
        const foundActionRejectedCoin = await driver.verifyActionOutput(`${Coins.PENNY} ${VM_STR_COIN_REJECTED}`);
        expect(foundActionRejectedCoin).toBe(true);
    });

    it('Should report a FOREIGN_COIN was rejected', async () => {
        await driver.insertCoin(Coins.FOREIGN_COIN);
        const foundActionRejectedCoin = await driver.verifyActionOutput(`${Coins.FOREIGN_COIN} ${VM_STR_COIN_REJECTED}`);
        expect(foundActionRejectedCoin).toBe(true);
    });

    it('Should report a SLUG was rejected', async () => {
        await driver.insertCoin(Coins.SLUG);
        const foundActionRejectedCoin = await driver.verifyActionOutput(`${Coins.SLUG} ${VM_STR_COIN_REJECTED}`);
        expect(foundActionRejectedCoin).toBe(true);
    });

    it(`should dispense ${Products.COLA } after inserting 1.00`, async () => {
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

    it(`should dispense ${Products.COLA } after inserting 10 dimes`, async () => {
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
});
