import {
  CoinMechanismInsertedCoinsInterface,
  CoinMechanismDispenseCoinsInterface,
  VendingMechanismProductDispenseInterface,
  DisplayInterface
} from '../../src/interfaces';
import { TerminalInterface } from '../../src/Simulator/interfaces'
import { VendingMechanismProductSelectSimulatorAdapter } from '../../src/VendingMechanismAdapters/VendingMechanismProductSelectSimulatorAdapter';
import { SystemSimulatorAdapter } from '../../src/SystemAdapters/SystemSimulatorAdapter'
import { VendingMachine } from '../../src/VendingMachine';
import { CurrencyHandler } from '../../src/CurrencyHandler';
import { CurrencyInventory } from '../../src/CurrencyInventory';
import { VendingHandler } from '../../src/VendingHandler';
import { delay } from '../../src/utils/delay';
import { SystemEvents, Products, Coins, CoinsInventory } from '../../src/types';
import { VM_STR_THANK_YOU, VM_STR_PRICE } from '../../src/constants/vending-machine-strings';

import { 
  VM_STR_INSERT_COIN,
  VM_STR_VERSION,
  VM_STR_POWERING_DOWN,
  VM_STR_SOLD_OUT,
  VM_STR_EXACT_CHANGE_ONLY
} from '../../src/constants/vending-machine-strings';

const FSM_TIMEOUT = 250;

let mockCoinMechanismInsertedCoinsAdapter: MockCoinMechanismInsertedCoinsAdapter;
let mockCoinMechanismMakeChangeAdapter: MockCoinMechanismMakeChangeAdapter;
let vendingMechanismProductSelectAdapter: VendingMechanismProductSelectSimulatorAdapter;
let mockVendingMechanismProductDispenseSimulatorAdapter: MockVendingMechanismProductDispenseSimulatorAdapter;
let mockDisplayAdapter: MockDisplayAdapter;
let terminalStub: TerminalStub;
let systemSimulatorAdapter: SystemSimulatorAdapter;
let currencyInventory: CurrencyInventory;
let currencyHandler: CurrencyHandler;
let vendingHandler: VendingHandler;
const NUMBER_OF_QUARTERS: number = 10;
const NUMBER_OF_DIMES: number = 10;
const NUMBER_OF_NICKELS: number = 10;

describe('Vending Machine', () => { 
    beforeEach(() => {
      const coinsInventory: CoinsInventory = {quarters: NUMBER_OF_QUARTERS, dimes: NUMBER_OF_DIMES, nickels: NUMBER_OF_NICKELS};
      mockCoinMechanismInsertedCoinsAdapter = new MockCoinMechanismInsertedCoinsAdapter();
      mockCoinMechanismMakeChangeAdapter = new MockCoinMechanismMakeChangeAdapter();
      currencyInventory = new CurrencyInventory(coinsInventory);
      currencyHandler = new CurrencyHandler(mockCoinMechanismInsertedCoinsAdapter, mockCoinMechanismMakeChangeAdapter, currencyInventory)
      mockVendingMechanismProductDispenseSimulatorAdapter = new MockVendingMechanismProductDispenseSimulatorAdapter(null);
      mockDisplayAdapter = new MockDisplayAdapter();
      systemSimulatorAdapter = new SystemSimulatorAdapter();
      terminalStub = new TerminalStub();
      vendingMechanismProductSelectAdapter = new VendingMechanismProductSelectSimulatorAdapter(terminalStub);
      vendingHandler = new VendingHandler(vendingMechanismProductSelectAdapter, mockVendingMechanismProductDispenseSimulatorAdapter);

      new VendingMachine(
        mockDisplayAdapter,
        currencyHandler,
        vendingHandler,
        systemSimulatorAdapter
      );
    });

    afterAll( async () => {
      await powerOffSystem();
    });

    it('Should start up on POWER_ON and shut down on POWER_DOWN events', async () => {
      const powerOnSystemResult = await powerOnSystem();
      expect(powerOnSystemResult).toBe(true);

      const powerOffSystemResult = await powerOffSystem();
      expect(powerOffSystemResult).toBe(true);
    });

    it(`Should display ${VM_STR_VERSION} followed by ${VM_STR_INSERT_COIN}`, async () => {
      await powerOnSystem();
      await delay(300);
      await powerOffSystem();

      const stringsDisplayed = mockDisplayAdapter.getStringsDisplayed();
      expect(stringsDisplayed[0]).toContain(VM_STR_VERSION);
      expect(stringsDisplayed[1]).toBe(VM_STR_INSERT_COIN);
    });

    it('Should display 0.25 after a quarter is inserted', async () => {
      await powerOnSystem();
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      const found25Cents = await waitForVendingMachineToDisplay('0.25');
      expect(found25Cents).toBe(true);
      await powerOffSystem();
    });

    it('Should display 0.10 after a dime is inserted', async () => {
      await powerOnSystem();
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.DIME);
      const found10Cents = await waitForVendingMachineToDisplay('0.10');
      expect(found10Cents).toBe(true);
      await powerOffSystem();
    });

    it('Should display 0.05 after a nickel is inserted', async () => {
      await powerOnSystem();
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.NICKEL);
      const found5Cents = await waitForVendingMachineToDisplay('0.05');
      expect(found5Cents).toBe(true);
      await powerOffSystem();
    });

    it('Should display 0.80 after 2 quarters, 2 dimes, 2 nickels are inserted', async () => {
      await powerOnSystem();
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.25');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.50');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.DIME);
      await waitForVendingMachineToDisplay('0.60');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.DIME);
      await waitForVendingMachineToDisplay('0.70');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.NICKEL);
      await waitForVendingMachineToDisplay('0.75');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.NICKEL);
      const found80Cents = await waitForVendingMachineToDisplay('0.80');
      expect(found80Cents).toBe(true);
      await powerOffSystem();
    });

    it('Should display 0.50 after 2 quarters are inserted', async () => {
      await powerOnSystem();
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.25');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      const found50Cents = await waitForVendingMachineToDisplay('0.50');
      expect(found50Cents).toBe(true);
      await powerOffSystem();
    });

    it('Should display 0.40 after a quarter, a dime and a nickel are inserted', async () => {
      await powerOnSystem();
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.25');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.DIME);
      await waitForVendingMachineToDisplay('0.35');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.NICKEL)
      const found40Cents = await waitForVendingMachineToDisplay('0.40');
      expect(found40Cents).toBe(true);
      await powerOffSystem();
    });

    it('Should dispense COLA after inserting 1.00 and COLA is selected', async () => {
      await powerOnSystem();
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.25');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.50');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.75');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('1.00');
      vendingMechanismProductSelectAdapter.selectProduct(Products.COLA);
      await waitForVendingMachineToDisplay(VM_STR_THANK_YOU);
      const lastProductDispensed = mockVendingMechanismProductDispenseSimulatorAdapter.getLastProductDispensed();
      expect(lastProductDispensed).toBe(Products.COLA);
      await powerOffSystem();
    });

    it('Should dispense CANDY after inserting 0.65 and CANDY is selected', async () => {
      await powerOnSystem();
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.25');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.50');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.DIME);
      await waitForVendingMachineToDisplay('0.60');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.NICKEL);
      await waitForVendingMachineToDisplay('0.65');
      vendingMechanismProductSelectAdapter.selectProduct(Products.CANDY);
      await waitForVendingMachineToDisplay(VM_STR_THANK_YOU);
      const lastProductDispensed = mockVendingMechanismProductDispenseSimulatorAdapter.getLastProductDispensed();
      expect(lastProductDispensed).toBe(Products.CANDY);
      await powerOffSystem();
    });

    it('Should dispense CHIPS after inserting 0.50 and CHIPS is selected', async () => {
      await powerOnSystem();
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.25');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.50');
      vendingMechanismProductSelectAdapter.selectProduct(Products.CHIPS);
      await waitForVendingMachineToDisplay(VM_STR_THANK_YOU);
      const lastProductDispensed = mockVendingMechanismProductDispenseSimulatorAdapter.getLastProductDispensed();
      expect(lastProductDispensed).toBe(Products.CHIPS);
      await powerOffSystem();
    });

    it(`Should display ${VM_STR_THANK_YOU} after a product is successfully dispensed`, async () => {
      await powerOnSystem();
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.25');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.50');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.75');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('1.00');
      vendingMechanismProductSelectAdapter.selectProduct(Products.COLA);
      const foundThankYouMessage = await waitForVendingMachineToDisplay(VM_STR_THANK_YOU);
      expect(foundThankYouMessage).toBe(true);
      await powerOffSystem();
    });

    it(`Should display ${VM_STR_INSERT_COIN} after dispensing product`, async () => {
      await powerOnSystem();
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.25');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.50');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.75');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('1.00');
      mockDisplayAdapter.clearStringsDisplayed();
      vendingMechanismProductSelectAdapter.selectProduct(Products.COLA);
      const foundInsertCoinMessage = await waitForVendingMachineToDisplay(VM_STR_INSERT_COIN);
      expect(foundInsertCoinMessage).toBe(true);
      await powerOffSystem();
    });

    it('Should NOT dispense COLA after inserting .50 and COLA is selected', async () => {
      await powerOnSystem();
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.25');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.50');
      vendingMechanismProductSelectAdapter.selectProduct(Products.COLA);
      await waitForVendingMachineToDisplay(VM_STR_THANK_YOU);
      const lastProductDispensed = mockVendingMechanismProductDispenseSimulatorAdapter.getLastProductDispensed();
      expect(lastProductDispensed).toBe(Products.NO_PRODUCT);
      await powerOffSystem();
    });

    it(`Should display ${VM_STR_PRICE} 1.00 when no coins have been inserted and COLA is selected`, async () => {
      await powerOnSystem();
      await waitForVendingMachineToDisplay(VM_STR_INSERT_COIN);
      vendingMechanismProductSelectAdapter.selectProduct(Products.COLA);
      const foundPriceMessage = await waitForVendingMachineToDisplay(`${VM_STR_PRICE} 1.00`);
      expect(foundPriceMessage).toBe(true);
      await powerOffSystem();
    });

    it(`Should display ${VM_STR_INSERT_COIN} after price message when no coins have been inserted and COLA is selected`, async () => {
      await powerOnSystem();
      await waitForVendingMachineToDisplay(VM_STR_INSERT_COIN);
      mockDisplayAdapter.clearStringsDisplayed();
      vendingMechanismProductSelectAdapter.selectProduct(Products.COLA);
      await waitForVendingMachineToDisplay(`${VM_STR_PRICE} 1.00`);
      const foundInsertCoinMessage = await waitForVendingMachineToDisplay(VM_STR_INSERT_COIN);
      expect(foundInsertCoinMessage).toBe(true);
      await powerOffSystem();
    });

    it('Should display current balance after price message when 0.50 has been inserted and COLA is selected', async () => {
      await powerOnSystem();
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.25');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.50');
      mockDisplayAdapter.clearStringsDisplayed();
      vendingMechanismProductSelectAdapter.selectProduct(Products.COLA);
      await waitForVendingMachineToDisplay(`${VM_STR_PRICE} 1.00`);
      const foundTotalAmountMessage = await waitForVendingMachineToDisplay('0.50');
      expect(foundTotalAmountMessage).toBe(true);
      await powerOffSystem();
    });

    it('Should NOT display current balance after price message when no coins have been inserted and COLA is selected', async () => {
      await powerOnSystem();
      vendingMechanismProductSelectAdapter.selectProduct(Products.COLA);
      await waitForVendingMachineToDisplay(`${VM_STR_PRICE} 1.00`);
      const foundTotalAmountMessage = await waitForVendingMachineToDisplay('0.00');
      expect(foundTotalAmountMessage).toBe(false);
      await powerOffSystem();
    });

    it('Should dispense a DIME after inserting 75 cents and purchasing a product that costs 65 cents', async () => {
      await powerOnSystem();
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.25');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.50');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.75');
      vendingMechanismProductSelectAdapter.selectProduct(Products.CANDY);
      await waitForVendingMachineToDisplay(VM_STR_THANK_YOU);
      const coinsDispensed = mockCoinMechanismMakeChangeAdapter.getCoinsDispensed();
      expect(coinsDispensed[0]).toBe(Coins.DIME);
      await powerOffSystem();
    });

    it('Should dispense 2 quarters after inserting 1.50 and purchasing a product that costs 1.00', async () => {
      await powerOnSystem();
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.25');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.50');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.75');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('1.00');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('1.25');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('1.50');
      vendingMechanismProductSelectAdapter.selectProduct(Products.COLA);
      await waitForVendingMachineToDisplay(VM_STR_THANK_YOU);
      const coinsDispensed = mockCoinMechanismMakeChangeAdapter.getCoinsDispensed();
      expect(coinsDispensed[0]).toBe(Coins.QUARTER);
      expect(coinsDispensed[1]).toBe(Coins.QUARTER);
      expect(coinsDispensed.length).toBe(2);
      await powerOffSystem();
    });

    it('Should return all coins in pending transaction when coin return is activated', async () => {
      await powerOnSystem();
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.25');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.DIME);
      await waitForVendingMachineToDisplay('0.35');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.NICKEL);
      await waitForVendingMachineToDisplay('0.40');
      mockCoinMechanismInsertedCoinsAdapter.setReturnCoinsStatusToTrue();
      await waitForMachineToDispenseCoins(3);
      const coinsDispensed = mockCoinMechanismMakeChangeAdapter.getCoinsDispensed();
      expect(coinsDispensed.length).toBe(3);
      expect(coinsDispensed.includes(Coins.QUARTER)).toBe(true);
      expect(coinsDispensed.includes(Coins.DIME)).toBe(true);
      expect(coinsDispensed.includes(Coins.NICKEL)).toBe(true);
      await powerOffSystem();
    });

    it(`Should display ${VM_STR_INSERT_COIN} after coin return has been activated`, async () => {
      await powerOnSystem();
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.25');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.DIME);
      await waitForVendingMachineToDisplay('0.35');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.NICKEL);
      await waitForVendingMachineToDisplay('0.40');
      mockDisplayAdapter.clearStringsDisplayed(); 
      mockCoinMechanismInsertedCoinsAdapter.setReturnCoinsStatusToTrue();
      await waitForMachineToDispenseCoins(3);
      const coinsDispensed = mockCoinMechanismMakeChangeAdapter.getCoinsDispensed();
      if (coinsDispensed.length !== 3) {
        throw new Error('Cannot continue test because coins were not returned');
      }
      const stringsDisplayed = mockDisplayAdapter.getStringsDisplayed();
      await waitForVendingMachineToDisplay(VM_STR_INSERT_COIN);
      expect(stringsDisplayed[0]).toBe(VM_STR_INSERT_COIN);
      await powerOffSystem();
    });

    it('Should ignore when coin return is activated a second time', async () => {
      await powerOnSystem();
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.25');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.DIME);
      await waitForVendingMachineToDisplay('0.35');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.NICKEL);
      await waitForVendingMachineToDisplay('0.40');
      mockCoinMechanismInsertedCoinsAdapter.setReturnCoinsStatusToTrue();
      await waitForMachineToDispenseCoins(3);
      const coinsDispensed = mockCoinMechanismMakeChangeAdapter.getCoinsDispensed();
      if (coinsDispensed.length !== 3) {
        throw new Error('Cannot continue test because coins were not returned');
      }
      mockCoinMechanismMakeChangeAdapter.clearCoinsDispensed();
      mockCoinMechanismInsertedCoinsAdapter.setReturnCoinsStatusToTrue();
      await waitForMachineToDispenseCoins(1);
      const coinsDispensedSecondAttempt = mockCoinMechanismMakeChangeAdapter.getCoinsDispensed();
      expect(coinsDispensedSecondAttempt.length).toBe(0);
      await powerOffSystem();
    });

    it(`Should display ${VM_STR_SOLD_OUT} when cola selected and it is out of stock`, async () => {
      await powerOnSystem();
      vendingMechanismProductSelectAdapter.setProductOutOfStockStatus(Products.COLA);
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.25');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.50');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.75');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('1.00');
      vendingMechanismProductSelectAdapter.selectProduct(Products.COLA);
      const foundSoldOutMessage = await waitForVendingMachineToDisplay(VM_STR_SOLD_OUT);
      expect(foundSoldOutMessage).toBe(true);
      await powerOffSystem();
    });

    it(`Should display pending amount after displaying ${VM_STR_SOLD_OUT}`, async () => {
      await powerOnSystem();
      vendingMechanismProductSelectAdapter.setProductOutOfStockStatus(Products.COLA);
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.25');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.50');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.75');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('1.00');
      mockDisplayAdapter.clearStringsDisplayed();      
      vendingMechanismProductSelectAdapter.selectProduct(Products.COLA);
      await waitForVendingMachineToDisplay(VM_STR_SOLD_OUT);
      const foundPendingAmount = await waitForVendingMachineToDisplay('1.00');
      expect(foundPendingAmount).toBe(true);
      await powerOffSystem();
    });

    it(`Should display ${VM_STR_INSERT_COIN} after displaying ${VM_STR_SOLD_OUT} when pending amount is zero`, async () => {
      await powerOnSystem();
      vendingMechanismProductSelectAdapter.setProductOutOfStockStatus(Products.COLA);
      vendingMechanismProductSelectAdapter.selectProduct(Products.COLA);
      await waitForVendingMachineToDisplay(VM_STR_SOLD_OUT);
      mockDisplayAdapter.clearStringsDisplayed();      
      const foundInsertCoinMessage = await waitForVendingMachineToDisplay(VM_STR_INSERT_COIN);
      expect(foundInsertCoinMessage).toBe(true);
      await powerOffSystem();
    });

    it('Should dispense 2 Nickels when the machine is out of dimes after inserting 75 cents and purchasing a product that costs 65 cents', async () => {
      await powerOnSystem();
      currencyInventory.deleteCoinsFromInventory({quarters: 0, dimes: NUMBER_OF_DIMES, nickels: 0});
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.25');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.50');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.75');
      vendingMechanismProductSelectAdapter.selectProduct(Products.CANDY);
      await waitForVendingMachineToDisplay(VM_STR_THANK_YOU);
      const coinsDispensed = mockCoinMechanismMakeChangeAdapter.getCoinsDispensed();
      expect(coinsDispensed[0]).toBe(Coins.NICKEL);
      expect(coinsDispensed[1]).toBe(Coins.NICKEL);
      await powerOffSystem();
    });

    it('Should decrement inventory of dimes after dispensing a dime in change', async () => {
      await powerOnSystem();
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.25');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.50');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.75');
      vendingMechanismProductSelectAdapter.selectProduct(Products.CANDY);
      await waitForVendingMachineToDisplay(VM_STR_THANK_YOU);
      const inventoryOfCoins = currencyInventory.getCoinInventory();
      expect(inventoryOfCoins.dimes).toBe(NUMBER_OF_DIMES - 1);
      await powerOffSystem();
    });

    it('Should increment inventory of quarters by 3 after purchase of product using 3 quarters', async () => {
      await powerOnSystem();
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.25');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.50');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.75');
      vendingMechanismProductSelectAdapter.selectProduct(Products.CANDY);
      mockDisplayAdapter.clearStringsDisplayed();
      await waitForVendingMachineToDisplay(VM_STR_INSERT_COIN);
      const inventoryOfCoins = currencyInventory.getCoinInventory();
      expect(inventoryOfCoins.quarters).toBe(NUMBER_OF_QUARTERS + 3);
      await powerOffSystem();
    });
    
    it(`Should display ${VM_STR_EXACT_CHANGE_ONLY} after a transaction reduces the coin inventory so that it cannot make correct change`, async () => {
      await powerOnSystem();
      currencyInventory.deleteCoinsFromInventory({quarters: 0, dimes: NUMBER_OF_DIMES - 1, nickels: NUMBER_OF_NICKELS - 1});
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.25');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.50');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.75');
      vendingMechanismProductSelectAdapter.selectProduct(Products.CANDY);
      const foundExactChangeMessage = await waitForVendingMachineToDisplay(VM_STR_EXACT_CHANGE_ONLY);
      expect(foundExactChangeMessage).toBe(true);
      await powerOffSystem();
    });

    it(`Should display 0.25 after entering ${VM_STR_EXACT_CHANGE_ONLY} mode and a quarter is inserted`, async () => {
      await powerOnSystem();
      currencyInventory.deleteCoinsFromInventory({quarters: NUMBER_OF_QUARTERS, dimes: NUMBER_OF_DIMES, nickels: NUMBER_OF_NICKELS});
      await waitForVendingMachineToDisplay(VM_STR_EXACT_CHANGE_ONLY);
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      const found25Cents = await waitForVendingMachineToDisplay('0.25');
      expect(found25Cents).toBe(true);
      await powerOffSystem();
    });

    it(`Should return all coins in pending transaction after entering ${VM_STR_EXACT_CHANGE_ONLY} mode when coin return is activated`, async () => {
      await powerOnSystem();
      currencyInventory.deleteCoinsFromInventory({quarters: NUMBER_OF_QUARTERS, dimes: NUMBER_OF_DIMES, nickels: NUMBER_OF_NICKELS});
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.25');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.DIME);
      await waitForVendingMachineToDisplay('0.35');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.NICKEL);
      await waitForVendingMachineToDisplay('0.40');
      mockCoinMechanismInsertedCoinsAdapter.setReturnCoinsStatusToTrue();
      await waitForMachineToDispenseCoins(3);
      const coinsDispensed = mockCoinMechanismMakeChangeAdapter.getCoinsDispensed();
      expect(coinsDispensed.length).toBe(3);
      expect(coinsDispensed.includes(Coins.QUARTER)).toBe(true);
      expect(coinsDispensed.includes(Coins.DIME)).toBe(true);
      expect(coinsDispensed.includes(Coins.NICKEL)).toBe(true);
      await powerOffSystem();
    });

    it(`Should dispense CHIPS after entering ${VM_STR_EXACT_CHANGE_ONLY} mode after inserting 0.50 and selecting CHIPS`, async () => {
      await powerOnSystem();
      currencyInventory.deleteCoinsFromInventory({quarters: NUMBER_OF_QUARTERS, dimes: NUMBER_OF_DIMES, nickels: NUMBER_OF_NICKELS});
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.25');
      mockCoinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
      await waitForVendingMachineToDisplay('0.50');
      vendingMechanismProductSelectAdapter.selectProduct(Products.CHIPS);
      await waitForVendingMachineToDisplay(VM_STR_THANK_YOU);
      const lastProductDispensed = mockVendingMechanismProductDispenseSimulatorAdapter.getLastProductDispensed();
      expect(lastProductDispensed).toBe(Products.CHIPS);
      await powerOffSystem();
    });
});

async function waitForMachineToDispenseCoins(expectedNumberOfCoins: number): Promise<void> {
  let coinsDispensed: Coins[];
  let count = FSM_TIMEOUT;

  while (count > 0) {
      coinsDispensed = mockCoinMechanismMakeChangeAdapter.getCoinsDispensed();
      if (coinsDispensed.length >= expectedNumberOfCoins) {
        break;
      }
      await delay(5);
      count--;
  }
}

async function powerOnSystem(): Promise<boolean> {
  systemSimulatorAdapter.reportSystemEvent(SystemEvents.POWER_ON);
  return waitForVendingMachineToDisplay(VM_STR_INSERT_COIN);
}

async function powerOffSystem(): Promise<boolean> {
  systemSimulatorAdapter.reportSystemEvent(SystemEvents.POWER_DOWN);
  return waitForVendingMachineToDisplay(VM_STR_POWERING_DOWN);
}

async function waitForVendingMachineToDisplay(expectedDisplayOutput: string): Promise<boolean> {
  let count = FSM_TIMEOUT;

  while (count > 0) {
    const stringsDisplayed = mockDisplayAdapter.getStringsDisplayed();
    if (stringsDisplayed.includes(expectedDisplayOutput)) {
      return true;
    }
    await delay(5);
    count--;
  }
  
  return false;
}

class MockVendingMechanismProductDispenseSimulatorAdapter implements VendingMechanismProductDispenseInterface{
  private productDispensed: Products;

  constructor(private terminal: null) {
      this.productDispensed = Products.NO_PRODUCT;
  }

  public dispenseProduct(product: Products): void {
    this.productDispensed = product;
  }

  public getLastProductDispensed() {
    return this.productDispensed;
  }
}

class MockCoinMechanismInsertedCoinsAdapter implements CoinMechanismInsertedCoinsInterface {
  private insertedCoin = Coins.NO_COIN;
  private returnCoinsStatus = false;
  
  public insertCoin(coin: Coins): void {
      this.insertedCoin = coin;
  }

  public readInsertedCoin(): Coins {
    const coin = this.insertedCoin; 
    this.insertedCoin = Coins.NO_COIN;
    return coin;
  }

  public setReturnCoinsStatusToTrue(): void {
    this.returnCoinsStatus = true;
  }

  public readReturnCoinsStatus(): boolean {
    const returnCoinsStatus = this.returnCoinsStatus;
    this.returnCoinsStatus = false;
    return returnCoinsStatus;
  }

  public readPendingTransactionTotal(): number {
    return 0;
  }

  public resetPendingTransactionTotal(): void {
  }
}    

class MockCoinMechanismMakeChangeAdapter implements CoinMechanismDispenseCoinsInterface {
    private coinsDispensed: Coins[];
  
    constructor() {
      this.coinsDispensed = [];
    }

    public dispenseCoin(coin: Coins): void {
      this.coinsDispensed.push(coin);
    }

    public getCoinsDispensed(): Coins[] {
      return this.coinsDispensed;
    }

    public clearCoinsDispensed(): void {
      this.coinsDispensed = [];      
    }
    
}    

class MockDisplayAdapter implements DisplayInterface{
  private stringsDisplayed: string[];
  private previousOutputString: string;

  constructor() {
    this.stringsDisplayed = [];
    this.previousOutputString = '';
  }

  public output(str: string): void {
      if (str !== this.previousOutputString) {
          this.previousOutputString = str;
          this.stringsDisplayed.push(str);
      }
  }
  
  public getStringsDisplayed(): string[] {
      return this.stringsDisplayed;
  }

  public clearStringsDisplayed(): void {
    this.stringsDisplayed = [];
    this.previousOutputString = '';
  }
}

class TerminalStub implements TerminalInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  output(str: string): void {
  }  
}
