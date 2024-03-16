/* 
** Coin Mechanism Adapter for our simulator
*/
import { CoinMechanismInsertedCoinsInterface } from '../interfaces'
import { CoinType, coins } from '../types';

export class CoinMechanismInsertedCoinsSimulatorAdapter implements CoinMechanismInsertedCoinsInterface{
  readCoin(): CoinType {
    const coin = { name: coins.NO_COIN, value: 0 };
    return coin;
  }

  readPendingTransactionTotal(): number {
    return 0;
  }
}    
