import { Coins, CoinsInventory, Products } from "../../src/types";

export interface TestProtocolDriverInterface {
    setup(): Promise<void>;

    teardown(): Promise<void>;

    insertCoin(coin: Coins): Promise<void>;
    
    selectProduct(product: Products): Promise<void>;

    returnCoins(): Promise<void>;

    simulateProductEmptyEvent(product: Products): Promise<void>;

    verifyDisplayOutput(str: string): Promise<boolean>;

    clearSavedDisplayOutputMessages(): void;

    clearSavedActionOutputMessages(): void;

    clearAllSavedOutputMessages(): void;

    verifyActionOutput(str: string): Promise<boolean>;

    setCoinInventory(inventoryOfCoins: CoinsInventory): void;
}