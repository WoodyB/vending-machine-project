import { CoinType } from './types';

export interface CoinMechanismInsertedCoinsInterface {
    readCoin(): CoinType; 
    readPendingTransactionTotal(): number;
}

