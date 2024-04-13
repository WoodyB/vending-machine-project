import { CoinMechanismInsertedCoinsSimulatorAdapter } from '../../src/CoinMechanismAdapters/CoinMechanismInsertedCoinsSimulatorAdapter';
import { Coins } from '../../src/types';
import { TerminalInterface } from '../../src/Simulator/interfaces';
import { VM_STR_ACTION, VM_STR_COIN_REJECTED } from '../../src/constants/vending-machine-strings';

let terminalOutput: string[] = [];

describe('CoinMechanismInsertedCoinsSimulatorAdapter', () => {
    let coinMechanismInsertedCoinsSimulatorAdapter: CoinMechanismInsertedCoinsSimulatorAdapter;
    let mockTerminal: MockTerminal;

    beforeEach(() => {
        mockTerminal = new MockTerminal;
        coinMechanismInsertedCoinsSimulatorAdapter = new CoinMechanismInsertedCoinsSimulatorAdapter(mockTerminal);
      });

      afterEach(() => {
        terminalOutput = [];
      });
    
    it('Method readInsertedCoin() should return NO_COIN if no coins are inserted ', () => {
        const coin = coinMechanismInsertedCoinsSimulatorAdapter.readInsertedCoin();
        expect(coin).toBe(Coins.NO_COIN);
    });
    
    it(`Method readInsertedCoin() should return ${Coins.QUARTER} if a quarter is inserted `, () => {
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.QUARTER);
        const coin = coinMechanismInsertedCoinsSimulatorAdapter.readInsertedCoin();
        expect(coin).toBe(Coins.QUARTER);
    });

    it(`Method readInsertedCoin() should return ${Coins.DIME} if a dime is inserted `, () => {
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.DIME);
        const coin = coinMechanismInsertedCoinsSimulatorAdapter.readInsertedCoin();
        expect(coin).toBe(Coins.DIME);
    });

    it(`Method readInsertedCoin() should return ${Coins.NICKEL} if a dime is inserted `, () => {
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.NICKEL);
        const coin = coinMechanismInsertedCoinsSimulatorAdapter.readInsertedCoin();
        expect(coin).toBe(Coins.NICKEL);
    });

    it('Method readPendingTransactionTotal should return 0 if no coins are inserted ', () => {
        const pendingTransactionTotal = coinMechanismInsertedCoinsSimulatorAdapter.readPendingTransactionTotal();
        expect(pendingTransactionTotal).toBe(0);
    });

    it('Method readPendingTransactionTotal should return 0 if invalid coin penny is inserted ', () => {
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.PENNY);
        const pendingTransactionTotal = coinMechanismInsertedCoinsSimulatorAdapter.readPendingTransactionTotal();
        expect(pendingTransactionTotal).toBe(0);
    });
    
    it('Method readPendingTransactionTotal should return 0.25 if a quarter is inserted ', () => {
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.QUARTER);
        const pendingTransactionTotal = coinMechanismInsertedCoinsSimulatorAdapter.readPendingTransactionTotal();
        expect(pendingTransactionTotal).toBe(25);
    });

    it('Method readPendingTransactionTotal should return 0.10 if a dime is inserted ', () => {
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.DIME);
        const pendingTransactionTotal = coinMechanismInsertedCoinsSimulatorAdapter.readPendingTransactionTotal();
        expect(pendingTransactionTotal).toBe(10);
    });

    it('Method readPendingTransactionTotal should return 0.05 if a nickel is inserted ', () => {
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.NICKEL);
        const pendingTransactionTotal = coinMechanismInsertedCoinsSimulatorAdapter.readPendingTransactionTotal();
        expect(pendingTransactionTotal).toBe(5);
    });

    it('Method readPendingTransactionTotal should return 0.80 when 2 quarters, 2 dimes, 2 nickels inserted ', () => {
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.QUARTER);
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.QUARTER);
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.DIME);
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.DIME);
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.NICKEL);
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.NICKEL);
        const pendingTransactionTotal = coinMechanismInsertedCoinsSimulatorAdapter.readPendingTransactionTotal();
        expect(pendingTransactionTotal).toBe(80);
    });

    it('Should report a PENNY was rejected', () => {
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.PENNY);
        expect(terminalOutput[0]).toContain(`${VM_STR_ACTION} ${Coins.PENNY} ${VM_STR_COIN_REJECTED}`);
    });

    it('Should report a FOREIGN_COIN was rejected', () => {
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.FOREIGN_COIN);
        expect(terminalOutput[0]).toContain(`${VM_STR_ACTION} ${Coins.FOREIGN_COIN} ${VM_STR_COIN_REJECTED}`);
    });

    it('Should report a SLUG was rejected', () => {
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.SLUG);
        expect(terminalOutput[0]).toContain(`${VM_STR_ACTION} ${Coins.SLUG} ${VM_STR_COIN_REJECTED}`);
    });
});

class MockTerminal implements TerminalInterface {
    output(str: string): void {
      terminalOutput.push(str);
    }
  }
