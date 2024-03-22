/* 
** Coin Mechanism Adapter for our simulator
*/

import { CoinMechanismInsertedCoinsInterface } from '../interfaces'
import {Coins } from '../types';

export class CoinMechanismInsertedCoinsSimulatorAdapter implements CoinMechanismInsertedCoinsInterface{
  private pendingTransactionTotal: number;

  constructor() {
    this.pendingTransactionTotal = 0;
  }

  public insertCoin(coin: Coins): void {
    //console.log(`DEBUG: Coin Mech insertCoin(${coin})`);
    if (coin === Coins.QUARTER) {
      this.pendingTransactionTotal += .25;
    }

    if (coin === Coins.DIME) {
      this.pendingTransactionTotal += .10;
    }
    
    if (coin === Coins.NICKEL) {
      this.pendingTransactionTotal += .05;
    }
  }

  public readPendingTransactionTotal(): number {
    return this.pendingTransactionTotal;
  }
}    
