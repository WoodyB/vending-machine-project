import { CoinMechanismInsertedCoinsSimulatorAdapter } from '../../src/CoinMechanismAdapters/CoinMechanismInsertedCoinsSimulatorAdapter';
import { Coins } from '../../src/types';

describe('CoinMechanismInsertedCoinsSimulatorAdapter', () => {
    let coinMechanismInsertedCoinsSimulatorAdapter: CoinMechanismInsertedCoinsSimulatorAdapter;

    beforeEach(() => {
        coinMechanismInsertedCoinsSimulatorAdapter = new CoinMechanismInsertedCoinsSimulatorAdapter();
      });
    
    it('Method readPendingTransactionTotal should return 0 if no coins are inserted ', () => {
        const pendingTransactionTotal = coinMechanismInsertedCoinsSimulatorAdapter.readPendingTransactionTotal();
        expect(pendingTransactionTotal).toBe(0);
    });

    it('Method readPendingTransactionTotal should return 0 if no valid coins are inserted ', () => {
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.PENNY);
        const pendingTransactionTotal = coinMechanismInsertedCoinsSimulatorAdapter.readPendingTransactionTotal();
        expect(pendingTransactionTotal).toBe(0);
    });
    
    it('Method readPendingTransactionTotal should return 0.25 if a quarter is inserted ', () => {
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.QUARTER);
        const pendingTransactionTotal = coinMechanismInsertedCoinsSimulatorAdapter.readPendingTransactionTotal();
        expect(pendingTransactionTotal).toBe(0.25);
    });

    it('Method readPendingTransactionTotal should return 0.10 if a dime is inserted ', () => {
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.DIME);
        const pendingTransactionTotal = coinMechanismInsertedCoinsSimulatorAdapter.readPendingTransactionTotal();
        expect(pendingTransactionTotal).toBe(0.10);
    });

    it('Method readPendingTransactionTotal should return 0.05 if a nickel is inserted ', () => {
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.NICKEL);
        const pendingTransactionTotal = coinMechanismInsertedCoinsSimulatorAdapter.readPendingTransactionTotal();
        expect(pendingTransactionTotal).toBe(0.05);
    });

    it('Method readPendingTransactionTotal should return 0.80 when 2 quarters, 2 dimes, 2 nickels inserted ', () => {
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.QUARTER);
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.QUARTER);
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.DIME);
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.DIME);
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.NICKEL);
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.NICKEL);
        const pendingTransactionTotal = coinMechanismInsertedCoinsSimulatorAdapter.readPendingTransactionTotal();
        expect(pendingTransactionTotal).toBe(0.80);
    });
    
});
