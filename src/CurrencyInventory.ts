import { CoinsInventory } from './types';

export class CurrencyInventory {
    private inventoryOfCoins: CoinsInventory;

    constructor(inventoryOfCoins: CoinsInventory) {
        this.inventoryOfCoins = inventoryOfCoins;
    }

    public getCoinInventory(): CoinsInventory {
        return this.inventoryOfCoins;
    }

    public addCoinsToInventory(inventoryOfCoinsToAdd: CoinsInventory): void {
        for (const coinType of Object.keys(inventoryOfCoinsToAdd) as (keyof CoinsInventory)[]) {
            this.inventoryOfCoins[coinType] += inventoryOfCoinsToAdd[coinType];
        }
    }

    public deleteCoinsFromInventory(inventoryOfCoinsToDelete: CoinsInventory): void {
        for (const coinType of Object.keys(inventoryOfCoinsToDelete) as (keyof CoinsInventory)[]) {
            this.inventoryOfCoins[coinType] -= inventoryOfCoinsToDelete[coinType];
            if (this.inventoryOfCoins[coinType] < 0) {
                this.inventoryOfCoins[coinType] = 0;                
            }
        }
    }
    
}
