/* eslint-disable @typescript-eslint/no-unused-vars */
import { Coins, CoinsInventory, Products } from "../../../../src/types";
import { TestProtocolDriverInterface } from "../../interfaces";
import { ManualTester } from "./ManualTester";

export class ManualProtocolDriver implements TestProtocolDriverInterface {
    private manualTester = new ManualTester();

    public setup(): Promise<void> {
        return this.manualTester.instruct('SETUP: Start the Vending Machine in a terminal');
    }

    public teardown(): Promise<void> {
        return this.manualTester.instruct('TEARDOWN: Shut down the Vending Machine in the terminal');
    }

    public insertCoin(coin: Coins): Promise<void> {
        return this.manualTester.instruct(`Insert ${coin}`);
    }
    
    public selectProduct(product: Products): Promise<void> {
        return this.manualTester.instruct(`Select ${product}`);
    }

    public returnCoins(): Promise<void> {
        return this.manualTester.instruct('Activate coin return');
    }

    public simulateProductEmptyEvent(product: Products): Promise<void> {
        return this.manualTester.instruct(`Simulate product empty ${product}`);
    }

    public verifyDisplayOutput(str: string): Promise<boolean> {
        return this.manualTester.queryYesNo(`Did message "${str}" display`);
    }

    public clearSavedDisplayOutputMessages(): void {
        // Nothing to do in manual mode
        return;
    }

    public clearSavedActionOutputMessages(): void {
        // Nothing to do in manual mode
        return;
    }

    public clearAllSavedOutputMessages(): void {
        // Nothing to do in manual mode
        return;
    }

    public verifyActionOutput(str: string): Promise<boolean> {
        return this.manualTester.queryYesNo(`Did "${str}" action display`);
    }

    public setCoinInventory(inventoryOfCoins: CoinsInventory): void {
        throw Error('Not implemented');
    }
}
