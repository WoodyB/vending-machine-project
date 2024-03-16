import { CoinType } from './types';

export interface CoinMechanismInsertedCoinsInterface {
    readCoin(): CoinType; 
    readPendingTransactionTotal(): number;
}

export interface DisplayInterface {
    output(str: string): void;
}
