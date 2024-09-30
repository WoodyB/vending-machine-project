/* eslint-disable @typescript-eslint/no-unused-vars */
import { Coins, CoinsInventory, Products } from "../../../../src/types";
import { TestProtocolDriverInterface } from "../../interfaces";

export class ManualProtocolDriver implements TestProtocolDriverInterface {
    public setup(): Promise<void> {
        throw Error('Not implemented');
    }

    public teardown(): Promise<void> {
        throw Error('Not implemented');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public insertCoin(coin: Coins): Promise<void> {
        throw Error('Not implemented');
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public selectProduct(product: Products): Promise<void> {
        throw Error('Not implemented');
    }

    public returnCoins(): Promise<void> {
        throw Error('Not implemented');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public simulateProductEmptyEvent(product: Products): Promise<void> {
        throw Error('Not implemented');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public verifyDisplayOutput(str: string): Promise<boolean> {
        throw Error('Not implemented');
    }

    public clearSavedDisplayOutputMessages(): void {
        throw Error('Not implemented');
    }

    public clearSavedActionOutputMessages(): void {
        throw Error('Not implemented');
    }

    public clearAllSavedOutputMessages(): void {
        throw Error('Not implemented');
    }

    public verifyActionOutput(str: string): Promise<boolean> {
        throw Error('Not implemented');
    }

    public setCoinInventory(inventoryOfCoins: CoinsInventory): void {
        throw Error('Not implemented');
    }
}
