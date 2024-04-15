import {
  CoinMechanismInsertedCoinsInterface,
  CoinMechanismDispenseCoinsInterface,
  CoinHandlerInterface
} from './interfaces';
import { Coins, PendingTotal } from './types';

export class CurrencyHandler {
  private pendingTransactionTotal: number;
  private coinHandlers: Map<Coins, CoinHandlerInterface>;
  private coinValuesMap: Record<Coins, number> = {
    [Coins.QUARTER]: 25,
    [Coins.DIME]: 10,
    [Coins.NICKEL]: 5,
    [Coins.NO_COIN]: 0,
    [Coins.PENNY]: 0,
    [Coins.SLUG]: 0,
    [Coins.FOREIGN_COIN]: 0
  };


  constructor(
    private coinMechanismInsertedCoinsAdapter: CoinMechanismInsertedCoinsInterface,
    private coinMechanismDispenseCoinsAdapter: CoinMechanismDispenseCoinsInterface

    ) {
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

  public dispenseChange(totalSubmitted: number, productCost: number): void {
    const changeDue = totalSubmitted - productCost;
    this.dispenseCoins(this.determineChangeInCoins(changeDue));
  }
  
  private dispenseCoins(coins: Coins[]): void {
    for (const coin of coins) {
      this.coinMechanismDispenseCoinsAdapter.dispenseCoin(coin);
    }
  }

  private determineChangeInCoins(change: number): Coins[] {
    let arrayOfCoins: Coins[] = [];

    const quarters = this.determineNumberOfCoins(Coins.QUARTER, change);
    change %= this.coinValuesMap[Coins.QUARTER];
    arrayOfCoins = arrayOfCoins.concat(quarters);

    const dimes = this.determineNumberOfCoins(Coins.DIME, change);
    change %= this.coinValuesMap[Coins.DIME];
    arrayOfCoins = arrayOfCoins.concat(dimes);

    const nickels = this.determineNumberOfCoins(Coins.NICKEL, change);
    change %= this.coinValuesMap[Coins.NICKEL];
    arrayOfCoins = arrayOfCoins.concat(nickels);
    
    return arrayOfCoins;
  }

  private determineNumberOfCoins(coinType: Coins, amount: number): Coins[] {
    const arrayOfCoins: Coins[] = [];
    
    const numberOfCoins = Math.floor(amount / this.coinValuesMap[coinType]);
    for (let i=0; i < numberOfCoins; i++) {
      arrayOfCoins.push(coinType);
    }
    return arrayOfCoins;
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
