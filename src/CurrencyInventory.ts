import { CoinsInventory, Coins } from './types';

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

    public addCoinToInventory(coin: Coins): void {
        if (coin === Coins.QUARTER) {
            this.inventoryOfCoins.quarters += 1;
            return;
        }
    
        if (coin === Coins.DIME) {
            this.inventoryOfCoins.dimes += 1;
            return;
        }

        if (coin === Coins.NICKEL) {
            this.inventoryOfCoins.nickels += 1;
            return;
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
