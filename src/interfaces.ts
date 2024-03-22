import { Coins, SystemEvents } from './types';

export interface CoinMechanismInsertedCoinsInterface {
    insertCoin(coin: Coins): void; 
    readPendingTransactionTotal(): number;
}

export interface DisplayInterface {
    output(str: string): void;
}

export interface SystemInterface {
    readSystemEvent(): SystemEvents;
    reportSystemEvent(event: SystemEvents): void;
}
