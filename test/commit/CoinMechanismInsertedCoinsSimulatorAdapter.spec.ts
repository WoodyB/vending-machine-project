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
    
    it('Method readInsertedCoin() should return NO_COIN if no coins are inserted', () => {
        const coin = coinMechanismInsertedCoinsSimulatorAdapter.readInsertedCoin();
        expect(coin).toBe(Coins.NO_COIN);
    });
    
    it(`Method readInsertedCoin() should return ${Coins.QUARTER} if a quarter is inserted`, () => {
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.QUARTER);
        const coin = coinMechanismInsertedCoinsSimulatorAdapter.readInsertedCoin();
        expect(coin).toBe(Coins.QUARTER);
    });

    it(`Method readInsertedCoin() should return ${Coins.DIME} if a dime is inserted`, () => {
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.DIME);
        const coin = coinMechanismInsertedCoinsSimulatorAdapter.readInsertedCoin();
        expect(coin).toBe(Coins.DIME);
    });

    it(`Method readInsertedCoin() should return ${Coins.NICKEL} if a dime is inserted`, () => {
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.NICKEL);
        const coin = coinMechanismInsertedCoinsSimulatorAdapter.readInsertedCoin();
        expect(coin).toBe(Coins.NICKEL);
    });

    it('Method readInsertedCoin() should only return inserted coin once after it is inserted', () => {
        coinMechanismInsertedCoinsSimulatorAdapter.insertCoin(Coins.NICKEL);
        const coinFirstRead = coinMechanismInsertedCoinsSimulatorAdapter.readInsertedCoin();
        if (coinFirstRead !== Coins.NICKEL) {
            throw new Error(`Did not read ${Coins.NICKEL} for first read after inserting a ${Coins.NICKEL}`);
        }
        const coinSecondRead = coinMechanismInsertedCoinsSimulatorAdapter.readInsertedCoin();
        expect(coinSecondRead).toBe(Coins.NO_COIN);
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

    it('Method readReturnCoinsStatus() should return FALSE if Return Coins has not been activated', () => {
        const readReturnCoinsStatus = coinMechanismInsertedCoinsSimulatorAdapter.readReturnCoinsStatus();
        expect(readReturnCoinsStatus).toBe(false);
    });

    it('Method readReturnCoinsStatus() should return TRUE if Return Coins has been activated', () => {
        coinMechanismInsertedCoinsSimulatorAdapter.setReturnCoinsStatusToTrue();
        const readReturnCoinsStatus = coinMechanismInsertedCoinsSimulatorAdapter.readReturnCoinsStatus();
        expect(readReturnCoinsStatus).toBe(true);
    });

    it('Method readReturnCoinsStatus() should only return TRUE once after Return Coins has been activated', () => {
        coinMechanismInsertedCoinsSimulatorAdapter.setReturnCoinsStatusToTrue();
        const readReturnCoinsStatusFirstRead = coinMechanismInsertedCoinsSimulatorAdapter.readReturnCoinsStatus();
        if (!readReturnCoinsStatusFirstRead) {
            throw new Error('Did not read true for first read after calling setReturnCoinsStatusToTrue()');
        }
        const readReturnCoinsStatusSecondRead = coinMechanismInsertedCoinsSimulatorAdapter.readReturnCoinsStatus();
        expect(readReturnCoinsStatusSecondRead).toBe(false);
    });
});

class MockTerminal implements TerminalInterface {
    output(str: string): void {
      terminalOutput.push(str);
    }
  }
