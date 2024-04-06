import { CoinMechanismInsertedCoinsInterface } from '../../src/interfaces';
import { VendingMechanismProductSelectSimulatorAdapter } from '../../src/VendingMechanismAdapters/VendingMechanismProductSelectSimulatorAdapter';
import { VendingMechanismProductDispenseInterface } from '../../src/interfaces';
import { DisplayInterface } from '../../src/interfaces'
import { SystemSimulatorAdapter } from '../../src/SystemAdapters/SystemSimulatorAdapter'
import { VendingMachine } from '../../src/VendingMachine';
import { delay } from '../../src/utils/delay';
import { SystemEvents, Products, Coins } from '../../src/types';
import { VM_STR_THANK_YOU } from '../../src/constants/vending-machine-strings'

import { 
  VM_STR_INSERT_COIN,
  VM_STR_VERSION,
  VM_STR_POWERING_DOWN
} from '../../src/constants/vending-machine-strings';

const FSM_TIMEOUT = 250;

let mockCoinMechanismInsertedCoinsAdapter: MockCoinMechanismInsertedCoinsAdapter;
let vendingMechanismProductSelectAdapter: VendingMechanismProductSelectSimulatorAdapter;
let mockVendingMechanismProductDispenseSimulatorAdapter: MockVendingMechanismProductDispenseSimulatorAdapter;
let mockDisplayAdapter: MockDisplayAdapter;
let systemSimulatorAdapter: SystemSimulatorAdapter;

describe('Vending Machine FSM', () => { 
    beforeEach(() => {
      mockCoinMechanismInsertedCoinsAdapter = new MockCoinMechanismInsertedCoinsAdapter();
      mockVendingMechanismProductDispenseSimulatorAdapter = new MockVendingMechanismProductDispenseSimulatorAdapter(null);
      mockDisplayAdapter = new MockDisplayAdapter();
      systemSimulatorAdapter = new SystemSimulatorAdapter();
      vendingMechanismProductSelectAdapter = new VendingMechanismProductSelectSimulatorAdapter();
      new VendingMachine(
        mockDisplayAdapter,
        mockCoinMechanismInsertedCoinsAdapter,
        vendingMechanismProductSelectAdapter,
        mockVendingMechanismProductDispenseSimulatorAdapter,
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
      mockCoinMechanismInsertedCoinsAdapter.updatePendingTransactionTotal(.25);
      const found25Cents = await waitForVendingMachineToDisplay('0.25');
      expect(found25Cents).toBe(true);
      await powerOffSystem();
    });

    it('Should dispense COLA after inserting 1.00 and COLA is selected', async () => {
      await powerOnSystem();
      mockCoinMechanismInsertedCoinsAdapter.updatePendingTransactionTotal(1.00);
      await waitForVendingMachineToDisplay('1.00');
      vendingMechanismProductSelectAdapter.selectProduct(Products.COLA);
      await waitForVendingMachineToDisplay(VM_STR_THANK_YOU);
      const lastProductDispensed = mockVendingMechanismProductDispenseSimulatorAdapter.getLastProductDispensed();
      expect(lastProductDispensed).toBe(Products.COLA);
      await powerOffSystem();
    });

    it(`Should display ${VM_STR_THANK_YOU} after dispensing a product is successfully dispensed`, async () => {
      await powerOnSystem();
      mockCoinMechanismInsertedCoinsAdapter.updatePendingTransactionTotal(1.00);
      await waitForVendingMachineToDisplay('1.00');
      vendingMechanismProductSelectAdapter.selectProduct(Products.COLA);
      const foundThankYouMessage = await waitForVendingMachineToDisplay(VM_STR_THANK_YOU);
      expect(foundThankYouMessage).toBe(true);
      await powerOffSystem();
    });

    it(`Should display ${VM_STR_INSERT_COIN} after dispensing product`, async () => {
      await powerOnSystem();
      mockCoinMechanismInsertedCoinsAdapter.updatePendingTransactionTotal(1.00);
      await waitForVendingMachineToDisplay('1.00');
      mockDisplayAdapter.clearStringsDisplayed();
      vendingMechanismProductSelectAdapter.selectProduct(Products.COLA);
      const foundInsertCoinMessage = await waitForVendingMachineToDisplay(VM_STR_INSERT_COIN);
      expect(foundInsertCoinMessage).toBe(true);
      await powerOffSystem();
    });

    it('Should NOT dispense COLA after inserting .50 and COLA is selected', async () => {
      await powerOnSystem();
      mockCoinMechanismInsertedCoinsAdapter.updatePendingTransactionTotal(0.50);
      await waitForVendingMachineToDisplay('0.50');
      vendingMechanismProductSelectAdapter.selectProduct(Products.COLA);
      await waitForVendingMachineToDisplay(VM_STR_THANK_YOU);
      const lastProductDispensed = mockVendingMechanismProductDispenseSimulatorAdapter.getLastProductDispensed();
      expect(lastProductDispensed).toBe(Products.NO_PRODUCT);
      await powerOffSystem();
    });
});

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

class MockCoinMechanismInsertedCoinsAdapter implements CoinMechanismInsertedCoinsInterface{
  private pendingTransactionTotal: number;
  
  constructor() {
    this.pendingTransactionTotal = 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public insertCoin(coin: Coins): void {
      /* Not used in unit testing but must exist to fulfill Interface */
    }
  
  public resetPendingTransactionTotal(): void {
    this.pendingTransactionTotal = 0;
  }

  public readPendingTransactionTotal(): number {
      return this.pendingTransactionTotal;
  }

  public updatePendingTransactionTotal(amount: number) {
      this.pendingTransactionTotal = amount;
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

