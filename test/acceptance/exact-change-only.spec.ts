import { determineProtocolDriver } from '../DSL/determineProtocolDriver';
import { Coins, Products } from '../../src/types';
import {
    VM_STR_PRODUCT_DISPENSED,
    VM_STR_EXACT_CHANGE_ONLY,
    VM_STR_INSERT_COIN,
    VM_STR_COIN_WAS_DISPENSED
} from '../../src/constants/vending-machine-strings'

jest.setTimeout(30000);

describe("Vending Machine", () => {
    const driver = determineProtocolDriver();

    beforeEach(async () => {
        await driver.setup();
    });

    afterEach(async () => {
        await driver.teardown();
    });

    it(`Should display ${VM_STR_EXACT_CHANGE_ONLY} after a transaction reduces the coin inventory so that it cannot make correct change`, async () => {
        driver.setCoinInventory({quarters: 0, dimes: 1, nickels: 0});
        const foundInsertCoinMessage = await driver.verifyDisplayOutput(VM_STR_INSERT_COIN);
        if (!foundInsertCoinMessage) {
            throw Error(`Cannot continue because ${VM_STR_INSERT_COIN} was not found`);
        }
        await driver.insertCoin(Coins.QUARTER);
        await driver.insertCoin(Coins.QUARTER);
        await driver.insertCoin(Coins.QUARTER);
        await driver.selectProduct(Products.CANDY);
        await driver.verifyActionOutput(`${Products.CANDY} ${VM_STR_PRODUCT_DISPENSED}`);
        const foundExactChangeOnlyMessage = await driver.verifyDisplayOutput(VM_STR_EXACT_CHANGE_ONLY);
        expect(foundExactChangeOnlyMessage).toBe(true);
    });

    it(`Should stop displaying ${VM_STR_EXACT_CHANGE_ONLY} after a transaction replenishes coin inventory threshold`, async () => {
        driver.setCoinInventory({quarters: 0, dimes: 0, nickels: 0});
        const foundExactChangeOnlyMessage = await driver.verifyDisplayOutput(VM_STR_EXACT_CHANGE_ONLY);
        if (!foundExactChangeOnlyMessage) {
            throw Error(`Cannot continue because ${VM_STR_EXACT_CHANGE_ONLY} was not found`);
        }
        await driver.insertCoin(Coins.QUARTER);
        await driver.insertCoin(Coins.QUARTER);
        await driver.insertCoin(Coins.NICKEL);
        await driver.insertCoin(Coins.NICKEL);
        await driver.insertCoin(Coins.NICKEL);
        await driver.selectProduct(Products.CANDY);
        const foundInsertCoinMessage = await driver.verifyDisplayOutput(VM_STR_INSERT_COIN);
        expect(foundInsertCoinMessage).toBe(true);
    });
    
    it(`Should return correct change when in ${VM_STR_EXACT_CHANGE_ONLY} and customer inserts needed coins in same transaction issue #532`, async () => {
        driver.setCoinInventory({quarters: 10, dimes: 0, nickels: 0});
        const foundExactChangeOnlyMessage = await driver.verifyDisplayOutput(VM_STR_EXACT_CHANGE_ONLY);
        if (!foundExactChangeOnlyMessage) {
            throw Error(`Cannot continue because ${VM_STR_EXACT_CHANGE_ONLY} was not found`);
        }
        await driver.insertCoin(Coins.DIME);
        await driver.insertCoin(Coins.DIME);
        await driver.insertCoin(Coins.DIME);
        await driver.insertCoin(Coins.DIME);
        await driver.insertCoin(Coins.DIME);
        await driver.insertCoin(Coins.DIME);
        await driver.insertCoin(Coins.NICKEL);
        await driver.selectProduct(Products.CHIPS);
        const foundDimeDispensed = await driver.verifyActionOutput(`${Coins.DIME} ${VM_STR_COIN_WAS_DISPENSED}`);
        expect(foundDimeDispensed).toBe(true);
        const foundNickelDispensed = await driver.verifyActionOutput(`${Coins.NICKEL} ${VM_STR_COIN_WAS_DISPENSED}`);
        expect(foundNickelDispensed).toBe(true);
    });
});
