import { CoinMechanismInsertedCoinsInterface, CoinHandlerInterface } from '../interfaces'
import { Coins } from '../types';

export class CoinMechanismInsertedCoinsSimulatorAdapter implements CoinMechanismInsertedCoinsInterface{
  private pendingTransactionTotal: number;
  private coinHandlers: Map<Coins, CoinHandlerInterface>;

  constructor() {
    this.pendingTransactionTotal = 0;
    this.coinHandlers = new Map<Coins, CoinHandlerInterface>();
    this.coinHandlers.set(Coins.QUARTER, new QuarterHandler);
    this.coinHandlers.set(Coins.DIME, new DimeHandler);
    this.coinHandlers.set(Coins.NICKEL, new NickelHandler);
  }

  public insertCoin(coin: Coins): void {
    //console.log(`DEBUG: Called insertCoin(${coin})`);
    const coinHandler = this.coinHandlers.get(coin);
    if (coinHandler) {
      this.pendingTransactionTotal = coinHandler.handleCoin(this.pendingTransactionTotal);
    }
  }

  public readPendingTransactionTotal(): number {
    return this.pendingTransactionTotal;
  }
}    

class QuarterHandler implements CoinHandlerInterface {
  handleCoin(total: number): number {
    return total + 0.25;
  }
}

class DimeHandler implements CoinHandlerInterface {
  handleCoin(total: number): number {
    return total + 0.10;
  }
}

class NickelHandler implements CoinHandlerInterface {
  handleCoin(total: number): number {
    return total + 0.05;
  }
}