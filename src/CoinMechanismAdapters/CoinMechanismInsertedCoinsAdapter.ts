/* 
** Place Holder: For a real Coin Mechanism Adapter
*/
import { CoinMechanismInsertedCoinsInterface } from '../interfaces'
import { CoinType } from '../types';

export class CoinMechanismInsertedCoinsAdapter implements CoinMechanismInsertedCoinsInterface{
  public readCoin(): CoinType {
    throw new Error('Method not implemented.');
  }
  public readPendingTransactionTotal(): number {
    throw new Error('Method not implemented.');
  }
}    
