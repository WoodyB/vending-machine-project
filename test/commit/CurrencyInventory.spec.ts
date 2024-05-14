import { CurrencyInventory } from '../../src/CurrencyInventory';
const QUARTERS_COUNT = 5;
const DIMES_COUNT = 5;
const NICKELS_COUNT = 5;

describe('CurrencyInventory', () => {
    let currencyInventory: CurrencyInventory;

    beforeEach(() => {
        currencyInventory = new CurrencyInventory(
            {quarters: QUARTERS_COUNT, dimes: DIMES_COUNT, nickels: NICKELS_COUNT}
        );
    });
    
    it('Should return initial inventory of coins if no coins have been added or deleted', () => {
        const inventoryOfCoins = currencyInventory.getCoinInventory();
        expect(inventoryOfCoins).toStrictEqual(
            {quarters: QUARTERS_COUNT, dimes: DIMES_COUNT, nickels: NICKELS_COUNT}
        );
    });

    it('Should return initial inventory plus one for quarters when a quarter is added to inventory', () => {
        currencyInventory.addCoinsToInventory({quarters: 1, dimes: 0, nickels: 0})
        const inventoryOfCoins = currencyInventory.getCoinInventory();
        expect(inventoryOfCoins).toStrictEqual({quarters: QUARTERS_COUNT + 1, dimes: DIMES_COUNT, nickels: NICKELS_COUNT});
    });
    
    it('Should return initial inventory plus one for dimes when a dime is added to inventory', () => {
        currencyInventory.addCoinsToInventory({quarters: 0, dimes: 1, nickels: 0})
        const inventoryOfCoins = currencyInventory.getCoinInventory();
        expect(inventoryOfCoins).toStrictEqual({quarters: QUARTERS_COUNT, dimes: DIMES_COUNT + 1, nickels: NICKELS_COUNT});
    });

    it('Should return initial inventory plus one for nickels when a nickel is added to inventory', () => {
        currencyInventory.addCoinsToInventory({quarters: 0, dimes: 0, nickels: 1})
        const inventoryOfCoins = currencyInventory.getCoinInventory();
        expect(inventoryOfCoins).toStrictEqual({quarters: QUARTERS_COUNT, dimes: DIMES_COUNT, nickels: NICKELS_COUNT + 1});
    });

    it('Should return initial inventory plus 1 quarter, plus 2 dimes and plus 3 nickels when 1 quarter, 2 dimes and 3 nickels added', () => {
        currencyInventory.addCoinsToInventory({quarters: 1, dimes: 2, nickels: 3})
        const inventoryOfCoins = currencyInventory.getCoinInventory();
        expect(inventoryOfCoins).toStrictEqual({quarters: QUARTERS_COUNT + 1, dimes: DIMES_COUNT + 2, nickels: NICKELS_COUNT + 3});
    });    

    it('Should return initial inventory minus one for quarters when a quarter is subtracted from inventory', () => {
        currencyInventory.deleteCoinsFromInventory({quarters: 1, dimes: 0, nickels: 0})
        const inventoryOfCoins = currencyInventory.getCoinInventory();
        expect(inventoryOfCoins).toStrictEqual({quarters: QUARTERS_COUNT - 1, dimes: DIMES_COUNT, nickels: NICKELS_COUNT});
    });

    it('Should return initial inventory minus one for dimes when a dime is subtracted from inventory', () => {
        currencyInventory.deleteCoinsFromInventory({quarters: 0, dimes: 1, nickels: 0})
        const inventoryOfCoins = currencyInventory.getCoinInventory();
        expect(inventoryOfCoins).toStrictEqual({quarters: QUARTERS_COUNT, dimes: DIMES_COUNT - 1, nickels: NICKELS_COUNT});
    });

    it('Should return initial inventory minus one for nickels when a nickel is subtracted from inventory', () => {
        currencyInventory.deleteCoinsFromInventory({quarters: 0, dimes: 0, nickels: 1})
        const inventoryOfCoins = currencyInventory.getCoinInventory();
        expect(inventoryOfCoins).toStrictEqual({quarters: QUARTERS_COUNT, dimes: DIMES_COUNT, nickels: NICKELS_COUNT - 1});
    });

    it('Should return 0s for inventory if more coins are deleted than in inventory', () => {
        currencyInventory.deleteCoinsFromInventory({quarters: 6, dimes: 6, nickels: 6})
        const inventoryOfCoins = currencyInventory.getCoinInventory();
        expect(inventoryOfCoins).toStrictEqual({quarters: 0, dimes: 0, nickels: 0});
    });
});