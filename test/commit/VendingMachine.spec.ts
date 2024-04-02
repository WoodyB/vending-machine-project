import { CoinMechanismInsertedCoinsUnitTestAdapter } from '../../src/CoinMechanismAdapters/CoinMechanismInsertedCoinsUnitTestAdapter';
import { DisplayUnitTestAdapter } from '../../src/DisplayAdapters/DisplayUnitTestAdapter';
import { SystemSimulatorAdapter } from '../../src/SystemAdapters/SystemSimulatorAdapter'
import { VendingMachine } from '../../src/VendingMachine';
import { delay } from '../../src/utils/delay';
import { SystemEvents} from '../../src/types';
import { 
  VM_STR_INSERT_COIN,
  VM_STR_VERSION,
  VM_STR_POWERING_DOWN } from '../../src/constants/vending-machine-strings';

const FSM_TIMEOUT = 50;

let mockCoinMechanismInsertedCoins: CoinMechanismInsertedCoinsUnitTestAdapter;
let mockDisplay: DisplayUnitTestAdapter;
let mockSystem: SystemSimulatorAdapter;

describe('Vending Machine FSM', () => { 
    beforeEach(() => {
      mockCoinMechanismInsertedCoins = new CoinMechanismInsertedCoinsUnitTestAdapter();
      mockDisplay = new DisplayUnitTestAdapter();
      mockSystem = new SystemSimulatorAdapter();
      new VendingMachine(mockDisplay, mockCoinMechanismInsertedCoins, mockSystem);
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
      mockCoinMechanismInsertedCoins.updatePendingTransactionTotal(.25);
      const found25Cents = await waitForVendingMachineToDisplay('0.25');
      expect(found25Cents).toBe(true);
      await powerOffSystem();
    });
});

async function powerOnSystem(): Promise<boolean> {
  mockSystem.reportSystemEvent(SystemEvents.POWER_ON);
  return waitForVendingMachineToDisplay(VM_STR_INSERT_COIN);
}

async function powerOffSystem(): Promise<boolean> {
  mockSystem.reportSystemEvent(SystemEvents.POWER_DOWN);
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
