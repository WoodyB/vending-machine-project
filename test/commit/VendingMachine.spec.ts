import { CoinMechanismInsertedCoinsUnitTestAdapter } from '../../src/CoinMechanismAdapters/CoinMechanismInsertedCoinsUnitTestAdapter';
import { VendingMechanismProductSelectSimulatorAdapter } from '../../src/VendingMechanismAdapters/VendingMechanismProductSelectSimulatorAdapter';
import { VendingMechanismProductDispenseInterface } from '../../src/interfaces';
import { DisplayUnitTestAdapter } from '../../src/DisplayAdapters/DisplayUnitTestAdapter';
import { SystemSimulatorAdapter } from '../../src/SystemAdapters/SystemSimulatorAdapter'
import { VendingMachine } from '../../src/VendingMachine';
import { delay } from '../../src/utils/delay';
import { SystemEvents} from '../../src/types';
import { Products } from '../../src/types';
import { VM_STR_THANK_YOU } from '../../src/constants/vending-machine-strings'

import { 
  VM_STR_INSERT_COIN,
  VM_STR_VERSION,
  VM_STR_POWERING_DOWN
} from '../../src/constants/vending-machine-strings';

const FSM_TIMEOUT = 50;

let mockCoinMechanismInsertedCoinsAdapter: CoinMechanismInsertedCoinsUnitTestAdapter;
let vendingMechanismProductSelectAdapter: VendingMechanismProductSelectSimulatorAdapter;
let mockVendingMechanismProductDispenseSimulatorAdapter: MockVendingMechanismProductDispenseSimulatorAdapter;
let mockDisplay: DisplayUnitTestAdapter;
let systemSimulatorAdapter: SystemSimulatorAdapter;

describe('Vending Machine FSM', () => { 
    beforeEach(() => {
      mockCoinMechanismInsertedCoinsAdapter = new CoinMechanismInsertedCoinsUnitTestAdapter();
      mockVendingMechanismProductDispenseSimulatorAdapter = new MockVendingMechanismProductDispenseSimulatorAdapter(null);
      mockDisplay = new DisplayUnitTestAdapter();
      systemSimulatorAdapter = new SystemSimulatorAdapter();
      vendingMechanismProductSelectAdapter = new VendingMechanismProductSelectSimulatorAdapter();
      new VendingMachine(
        mockDisplay,
        mockCoinMechanismInsertedCoinsAdapter,
        vendingMechanismProductSelectAdapter,
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

      const stringsDisplayed = mockDisplay.getStringsDisplayed();
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
    const stringsDisplayed = mockDisplay.getStringsDisplayed();
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