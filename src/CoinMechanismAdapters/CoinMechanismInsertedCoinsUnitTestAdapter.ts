/* 
** Used for unit testing
*/
import { CoinMechanismInsertedCoinsInterface } from '../interfaces'
import { CoinType, coins } from '../types';

export class CoinMechanismInsertedCoinsUnitTestAdapter implements CoinMechanismInsertedCoinsInterface{
    private pendingTransactionTotal: number;
  
    constructor() {
      this.pendingTransactionTotal = 0;
    }

    public readCoin(): CoinType {
        const coin = { name: coins.NO_COIN, value: 0 };
        return coin;
    }

    public readPendingTransactionTotal(): number {
        return this.pendingTransactionTotal;
    }

    public updatePendingTransactionTotal(amount: number) {
        this.pendingTransactionTotal = amount;
    }
}    
