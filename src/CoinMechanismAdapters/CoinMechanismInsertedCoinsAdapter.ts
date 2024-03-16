/* 
** Place Holder: For a real Coin Mechanism Adapter
*/
import { CoinMechanismInsertedCoinsInterface } from '../interfaces'
import { CoinType } from '../types';

export class CoinMechanismInsertedCoinsAdapter implements CoinMechanismInsertedCoinsInterface{
  readCoin(): CoinType {
    throw new Error('Method not implemented.');
  }
  readPendingTransactionTotal(): number {
    throw new Error('Method not implemented.');
  }
}    
