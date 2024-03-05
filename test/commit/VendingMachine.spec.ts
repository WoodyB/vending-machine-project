import { CoinMechanism } from '../../src/CoinMechanism';
import { VendingMachine } from '../../src/VendingMachine';

const StringsDisplayed: string[] = [];

class MockCoinMechanism extends CoinMechanism {
  private pendingTransactionTotal: number;

  constructor() {
    super();
    this.pendingTransactionTotal = 0;
  }

  public updatePendingTransactionTotal(amount: number) {
    this.pendingTransactionTotal = amount;
  }

  public getPendingTransactionTotal(): number {
    return this.pendingTransactionTotal;
  }
}

describe('Vending Machine Power up', () => {
    let mockCoinMechanism: MockCoinMechanism;
    let vendingMachine: VendingMachine;

    beforeEach(() => {
      mockCoinMechanism = new MockCoinMechanism();
        vendingMachine = new VendingMachine(myDisplay, mockCoinMechanism);
    });

    it('Should display Vending Machine Project Version followed by Insert Coin', () => {
      vendingMachine.start();
      expect(StringsDisplayed[0]).toContain('Vending Machine Project Version');
      expect(StringsDisplayed[1]).toBe('Insert Coin');
    });

    it('Should display 0.25 after a quarter is inserted', async () => {
      mockCoinMechanism.updatePendingTransactionTotal(.25);
      vendingMachine.start();
      expect(StringsDisplayed[StringsDisplayed.length - 1]).toBe('0.25');
    });
});

function myDisplay(str: string) {
  StringsDisplayed.push(str);
}
