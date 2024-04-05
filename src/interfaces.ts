import { Coins, SystemEvents, Products } from './types';

export interface CoinMechanismInsertedCoinsInterface {
    insertCoin(coin: Coins): void; 
    readPendingTransactionTotal(): number;
}

export interface VendingMechanismProductSelectInterface {
    selectProduct(product: Products): void; 
    readProductSelection(): Products;
}

export interface DisplayInterface {
    output(str: string): void;
}

export interface SystemInterface {
    readSystemEvent(): SystemEvents;
    reportSystemEvent(event: SystemEvents): void;
}

export interface CoinHandlerInterface {
    handleCoin(total: number): number;
  }

export interface VendingMechanismProductDispenseInterface {
    dispenseProduct(product: Products): void;
}
