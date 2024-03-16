import { CoinType, systemEvents } from './types';

export interface CoinMechanismInsertedCoinsInterface {
    readCoin(): CoinType; 
    readPendingTransactionTotal(): number;
}

export interface DisplayInterface {
    output(str: string): void;
}

export interface SystemInterface {
    readSystemEvent(): systemEvents;
}
