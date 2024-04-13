import { CurrencyHandler } from '../../src/CurrencyHandler';
import { TerminalInterface } from '../../src/Simulator/interfaces';
import { CoinMechanismInsertedCoinsSimulatorAdapter } from '../../src/CoinMechanismAdapters/CoinMechanismInsertedCoinsSimulatorAdapter';
import { Coins, PendingTotal } from '../../src/types';

describe('CurrencyHandler', () => {
    let currencyHandler!: CurrencyHandler;
    let coinMechanismInsertedCoinsAdapter!: CoinMechanismInsertedCoinsSimulatorAdapter;
    let fakeTerminal!: FakeTerminal;
 
    beforeEach(() => {
        fakeTerminal = new FakeTerminal();
        coinMechanismInsertedCoinsAdapter = new CoinMechanismInsertedCoinsSimulatorAdapter(fakeTerminal);
        currencyHandler = new CurrencyHandler(coinMechanismInsertedCoinsAdapter);
    });
    
    it('Method readPendingTransactionTotal should return amount = 0 if no coins are inserted', () => {
        const pendingTransactionTotal = currencyHandler.readPendingTransactionTotal();
        expect(pendingTransactionTotal.amount).toBe(0);
    });

    it('Method readPendingTransactionTotal should return changed = false if no coins are inserted', () => {
        const pendingTransactionTotal = currencyHandler.readPendingTransactionTotal();
        expect(pendingTransactionTotal.changed).toBe(false);
    });

    
    it('Method readPendingTransactionTotal should return amount = 25 if a quarter is inserted', () => {
        coinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
        const pendingTransactionTotal = currencyHandler.readPendingTransactionTotal();
        expect(pendingTransactionTotal.amount).toBe(25);
    });

    it('Method readPendingTransactionTotal should return amount = 10 if a dime is inserted', () => {
        coinMechanismInsertedCoinsAdapter.insertCoin(Coins.DIME);
        const pendingTransactionTotal = currencyHandler.readPendingTransactionTotal();
        expect(pendingTransactionTotal.amount).toBe(10);
    });

    it('Method readPendingTransactionTotal should return amount = 5 if a nickel is inserted', () => {
        coinMechanismInsertedCoinsAdapter.insertCoin(Coins.NICKEL);
        const pendingTransactionTotal = currencyHandler.readPendingTransactionTotal();
        expect(pendingTransactionTotal.amount).toBe(5);
    });

    it('Method readPendingTransactionTotal should return amount = 80 when 2 quarters, 2 dimes, 2 nickels inserted', () => {
        coinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
        currencyHandler.readPendingTransactionTotal();
        coinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
        currencyHandler.readPendingTransactionTotal();
        coinMechanismInsertedCoinsAdapter.insertCoin(Coins.DIME);
        currencyHandler.readPendingTransactionTotal();
        coinMechanismInsertedCoinsAdapter.insertCoin(Coins.DIME);
        currencyHandler.readPendingTransactionTotal();
        coinMechanismInsertedCoinsAdapter.insertCoin(Coins.NICKEL);
        currencyHandler.readPendingTransactionTotal();
        coinMechanismInsertedCoinsAdapter.insertCoin(Coins.NICKEL);
        currencyHandler.readPendingTransactionTotal();
        const pendingTransactionTotal = currencyHandler.readPendingTransactionTotal();
        expect(pendingTransactionTotal.amount).toBe(80);
    });

    it('Method readPendingTransactionTotal should return amount = 0 after reset', () => {
        coinMechanismInsertedCoinsAdapter.insertCoin(Coins.NICKEL);
        currencyHandler.readPendingTransactionTotal();
        coinMechanismInsertedCoinsAdapter.insertCoin(Coins.NICKEL);
        currencyHandler.readPendingTransactionTotal();
        currencyHandler.resetPendingTransactionTotal();
        const pendingTransactionTotal = currencyHandler.readPendingTransactionTotal();
        expect(pendingTransactionTotal.amount).toBe(0);
    });

    it('Method readPendingTransactionTotal should return changed = true when 2 quarters inserted', () => {
        let pendingTransactionTotal: PendingTotal;

        coinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
        pendingTransactionTotal = currencyHandler.readPendingTransactionTotal();
        expect(pendingTransactionTotal.changed).toBe(true);
        coinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
        pendingTransactionTotal = currencyHandler.readPendingTransactionTotal();
        expect(pendingTransactionTotal.changed).toBe(true);
    });

    it('Method readPendingTransactionTotal should return changed = false when there is no change between reads', () => {
        let pendingTransactionTotal: PendingTotal;

        coinMechanismInsertedCoinsAdapter.insertCoin(Coins.QUARTER);
        pendingTransactionTotal = currencyHandler.readPendingTransactionTotal();
        expect(pendingTransactionTotal.changed).toBe(true);
        pendingTransactionTotal = currencyHandler.readPendingTransactionTotal();
        expect(pendingTransactionTotal.changed).toBe(false);
    });


});

class FakeTerminal implements TerminalInterface {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public output(str: string): void {
    }
}
