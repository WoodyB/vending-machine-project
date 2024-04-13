import { CoinMechanismInsertedCoinsInterface, CoinHandlerInterface } from './interfaces';
import { Coins, PendingTotal } from './types';

export class CurrencyHandler {
  private pendingTransactionTotal: number;
  private coinHandlers: Map<Coins, CoinHandlerInterface>;

  constructor(private coinMechanismInsertedCoinsAdapter: CoinMechanismInsertedCoinsInterface) {
      this.coinMechanismInsertedCoinsAdapter = coinMechanismInsertedCoinsAdapter;
      this.pendingTransactionTotal = 0;
      this.coinHandlers = new Map<Coins, CoinHandlerInterface>();
      this.coinHandlers.set(Coins.QUARTER, new QuarterHandler);
      this.coinHandlers.set(Coins.DIME, new DimeHandler);
      this.coinHandlers.set(Coins.NICKEL, new NickelHandler);
  }

  public readPendingTransactionTotal(): PendingTotal {
    const coin = this.coinMechanismInsertedCoinsAdapter.readInsertedCoin();
    const coinHandler = this.coinHandlers.get(coin);
    const result: PendingTotal = {changed: false, amount: 0};

    if (coinHandler) {
        this.pendingTransactionTotal = coinHandler.handleCoin(this.pendingTransactionTotal);
        result.changed = true;
    }
    result.amount = this.pendingTransactionTotal;
    return result;
}

  public resetPendingTransactionTotal(): void {
      this.pendingTransactionTotal = 0;
  }        
}

class QuarterHandler implements CoinHandlerInterface {
  handleCoin(total: number): number {
    return total + 25;
  }
}
  
class DimeHandler implements CoinHandlerInterface {
  handleCoin(total: number): number {
    return total + 10;
  }
}
  
class NickelHandler implements CoinHandlerInterface {
  handleCoin(total: number): number {
    return total + 5;
  }
}
  