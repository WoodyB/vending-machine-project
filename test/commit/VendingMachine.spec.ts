import { CoinMechanismInsertedCoinsUnitTestAdapter } from '../../src/CoinMechanismAdapters/CoinMechanismInsertedCoinsUnitTestAdapter';
import { DisplayUnitTestAdapter } from '../../src/DisplayAdapters/DisplayUnitTestAdapter';
import { VendingMachine } from '../../src/VendingMachine';


describe('Vending Machine Power up', () => {
    let mockCoinMechanismInsertedCoins: CoinMechanismInsertedCoinsUnitTestAdapter;
    let mockDisplay: DisplayUnitTestAdapter;
    let vendingMachine: VendingMachine;
   
    beforeEach(() => {
      mockCoinMechanismInsertedCoins = new CoinMechanismInsertedCoinsUnitTestAdapter();
      mockDisplay = new DisplayUnitTestAdapter();
      vendingMachine = new VendingMachine(mockDisplay, mockCoinMechanismInsertedCoins);
    });

    it('Should display Vending Machine Project Version followed by Insert Coin', async () => {
      await vendingMachine.start();
      const stringsDisplayed = mockDisplay.getStringsDisplayed();
      expect(stringsDisplayed[0]).toContain('Vending Machine Project Version');
      expect(stringsDisplayed[1]).toBe('Insert Coin');
    });

    it('Should display 0.25 after a quarter is inserted', async () => {
      mockCoinMechanismInsertedCoins.updatePendingTransactionTotal(.25);
      await vendingMachine.start();
      const stringsDisplayed = mockDisplay.getStringsDisplayed();
      expect(stringsDisplayed[stringsDisplayed.length - 1]).toBe('0.25');
    });
});
