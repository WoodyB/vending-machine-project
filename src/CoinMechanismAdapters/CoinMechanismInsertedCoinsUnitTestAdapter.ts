/* 
** Coin Mechanism Adapter for unit testing
*/
import { CoinMechanismInsertedCoinsInterface } from '../interfaces'
import { Coins } from '../types';

export class CoinMechanismInsertedCoinsUnitTestAdapter implements CoinMechanismInsertedCoinsInterface{
    private pendingTransactionTotal: number;
  
    constructor() {
      this.pendingTransactionTotal = 0;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public insertCoin(coin: Coins): void {
        /* Not used in unit testing but must exist to fulfill Interface */
      }
    
    public readPendingTransactionTotal(): number {
        return this.pendingTransactionTotal;
    }

    public updatePendingTransactionTotal(amount: number) {
        this.pendingTransactionTotal = amount;
    }
}    
