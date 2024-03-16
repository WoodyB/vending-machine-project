import { CoinMechanismInsertedCoinsUnitTestAdapter } from '../../src/CoinMechanismAdapters/CoinMechanismInsertedCoinsUnitTestAdapter';
import { VendingMachine } from '../../src/VendingMachine';

const StringsDisplayed: string[] = [];


describe('Vending Machine Power up', () => {
    let mockCoinMechanismInsertedCoins: CoinMechanismInsertedCoinsUnitTestAdapter;
    let vendingMachine: VendingMachine;

    beforeEach(() => {
      mockCoinMechanismInsertedCoins = new CoinMechanismInsertedCoinsUnitTestAdapter();
        vendingMachine = new VendingMachine(myDisplay, mockCoinMechanismInsertedCoins);
    });

    it('Should display Vending Machine Project Version followed by Insert Coin', async () => {
      await vendingMachine.start();
      expect(StringsDisplayed[0]).toContain('Vending Machine Project Version');
      expect(StringsDisplayed[1]).toBe('Insert Coin');
    });

    it('Should display 0.25 after a quarter is inserted', async () => {
      mockCoinMechanismInsertedCoins.updatePendingTransactionTotal(.25);
      await vendingMachine.start();
      expect(StringsDisplayed[StringsDisplayed.length - 1]).toBe('0.25');
    });
});

function myDisplay(str: string) {
  StringsDisplayed.push(str);
}
