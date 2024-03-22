import { CoinMechanismInsertedCoinsUnitTestAdapter } from '../../src/CoinMechanismAdapters/CoinMechanismInsertedCoinsUnitTestAdapter';
import { DisplayUnitTestAdapter } from '../../src/DisplayAdapters/DisplayUnitTestAdapter';
import { SystemUnitTestAdapter } from '../../src/SystemAdapters/SystemUnitTestAdapter'
import { VendingMachine } from '../../src/VendingMachine';
import { delay } from '../../src/utils/delay';
import { SystemEvents} from '../../src/types';


describe('Vending Machine FSM', () => {
    let mockCoinMechanismInsertedCoins: CoinMechanismInsertedCoinsUnitTestAdapter;
    let mockDisplay: DisplayUnitTestAdapter;
    let mockSystem: SystemUnitTestAdapter;
    let vendingMachine: VendingMachine;
   
    beforeEach(() => {
      mockCoinMechanismInsertedCoins = new CoinMechanismInsertedCoinsUnitTestAdapter();
      mockDisplay = new DisplayUnitTestAdapter();
      mockSystem = new SystemUnitTestAdapter();
      vendingMachine = new VendingMachine(mockDisplay, mockCoinMechanismInsertedCoins, mockSystem);
    });

    it('Should shut down when it receives a POWER_DOWN', async () => {
      vendingMachine.start();
      await delay(300);
      mockSystem.setSystemEvent(SystemEvents.POWER_DOWN);
      await delay(100);
      const stringsDisplayed = mockDisplay.getStringsDisplayed();
      expect(stringsDisplayed[2]).toBe('Vending Machine Powering Down');
    });

    it('Should display Vending Machine Project Version followed by Insert Coin', async () => {
      vendingMachine.start();
      await delay(300);
      mockSystem.setSystemEvent(SystemEvents.POWER_DOWN);
      const stringsDisplayed = mockDisplay.getStringsDisplayed();
      expect(stringsDisplayed[0]).toContain('Vending Machine Project Version');
      expect(stringsDisplayed[1]).toBe('Insert Coin');
    });

    it('Should display 0.25 after a quarter is inserted', async () => {
      mockCoinMechanismInsertedCoins.updatePendingTransactionTotal(.25);
      vendingMachine.start();
      await delay(300);
      mockSystem.setSystemEvent(SystemEvents.POWER_DOWN);
      const stringsDisplayed = mockDisplay.getStringsDisplayed();
      expect(stringsDisplayed[1]).toBe('0.25');
    });
});
