import { CurrencyInventory } from './CurrencyInventory';
import {
  CoinMechanismInsertedCoinsInterface,
  CoinMechanismDispenseCoinsInterface,
  CoinHandlerInterface
} from './interfaces';
import { Coins, PendingTotal } from './types';

export class CurrencyHandler {
  private pendingTransactionTotal: number;
  private pendingTransactionCoins: Coins [];
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
    private coinMechanismDispenseCoinsAdapter: CoinMechanismDispenseCoinsInterface,
    private currencyInventory: CurrencyInventory

    ) {
      this.pendingTransactionTotal = 0;
      this.coinHandlers = new Map<Coins, CoinHandlerInterface>();
      this.coinHandlers.set(Coins.QUARTER, new QuarterHandler);
      this.coinHandlers.set(Coins.DIME, new DimeHandler);
      this.coinHandlers.set(Coins.NICKEL, new NickelHandler);
      this.pendingTransactionCoins = [];
  }

  public readPendingTransactionTotal(): PendingTotal {
    const coin = this.coinMechanismInsertedCoinsAdapter.readInsertedCoin();
    const coinHandler = this.coinHandlers.get(coin);
    const result: PendingTotal = {changed: false, amount: 0};

    if (coinHandler) {
        this.pendingTransactionTotal = coinHandler.handleCoin(this.pendingTransactionTotal);
        result.changed = true;
        this.pendingTransactionCoins.push(coin);
    }
    result.amount = this.pendingTransactionTotal;
    return result;
}

  public resetPendingTransactionTotal(): void {
      this.pendingTransactionTotal = 0;
      this.pendingTransactionCoins = [];
  }

  public dispenseChange(totalSubmitted: number, productCost: number): void {
    const changeDue = totalSubmitted - productCost;
    this.dispenseCoins(this.determineChangeInCoins(changeDue));
  }

  public readReturnCoinsStatus(): boolean {
    const returnCoinStatus = this.coinMechanismInsertedCoinsAdapter.readReturnCoinsStatus();
    return returnCoinStatus;
  }

  public returnPendingTransactionCoins(): void {
    this.dispenseCoins(this.pendingTransactionCoins);
    this.resetPendingTransactionTotal();
  }
  
  private dispenseCoins(coins: Coins[]): void {
    for (const coin of coins) {
      this.coinMechanismDispenseCoinsAdapter.dispenseCoin(coin);
    }
  }

  private determineChangeInCoins(change: number): Coins[] {
    let arrayOfCoins: Coins[] = [];

    const quarters = this.determineNumberOfCoins(Coins.QUARTER, change);
    change -= quarters.length * this.coinValuesMap[Coins.QUARTER];
    arrayOfCoins = arrayOfCoins.concat(quarters);

    const dimes = this.determineNumberOfCoins(Coins.DIME, change);
    change -= dimes.length * this.coinValuesMap[Coins.DIME];
    arrayOfCoins = arrayOfCoins.concat(dimes);

    const nickels = this.determineNumberOfCoins(Coins.NICKEL, change);
    change -= nickels.length * this.coinValuesMap[Coins.NICKEL];
    arrayOfCoins = arrayOfCoins.concat(nickels);
    
    return arrayOfCoins;
  }

  private determineNumberOfCoins(coinType: Coins, amount: number): Coins[] {
    const arrayOfCoins: Coins[] = [];
    let coinInventory: number = 0;    
    const coinsInventory = this.currencyInventory.getCoinInventory();

    if (coinType === Coins.QUARTER) {
      coinInventory = coinsInventory.quarters;
    }
    if (coinType === Coins.DIME) {
      coinInventory = coinsInventory.dimes;
    }
    if (coinType === Coins.NICKEL) {
      coinInventory = coinsInventory.nickels;
    }

    let numberOfCoins = Math.floor(amount / this.coinValuesMap[coinType]);

    if (numberOfCoins > coinInventory) {
      numberOfCoins = coinInventory;
    } 

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
