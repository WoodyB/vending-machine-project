import { CoinMechanismDispenseCoinsSimulatorAdapter } from '../../src/CoinMechanismAdapters/CoinMechanismDispenseCoinsSimulatorAdapter';
import { Coins } from '../../src/types';
import { TerminalInterface } from '../../src/Simulator/interfaces';
import { VM_STR_ACTION, VM_STR_CHANGE_DISPENSED } from '../../src/constants/vending-machine-strings';

let terminalOutput: string[] = [];

describe('CoinMechanismDispenseCoinsSimulatorAdapter', () => {
    let coinMechanismDispenseCoinsSimulatorAdapter: CoinMechanismDispenseCoinsSimulatorAdapter;
    let terminalSpy: TerminalSpy;

    beforeEach(() => {
        terminalSpy = new TerminalSpy();
        coinMechanismDispenseCoinsSimulatorAdapter = new CoinMechanismDispenseCoinsSimulatorAdapter(terminalSpy);
    });

    afterEach(() => {
        terminalOutput = [];
    });

    it(`Method dispenseCoin() should not dispense coin when coin is NO_COIN`, () => {
        coinMechanismDispenseCoinsSimulatorAdapter.dispenseCoin(Coins.NO_COIN);
        expect(terminalOutput.length).toBe(0);
    });
    
    it('Should report a Quarter was dispensed', () => {
        coinMechanismDispenseCoinsSimulatorAdapter.dispenseCoin(Coins.QUARTER);
        expect(terminalOutput[0]).toContain(`${VM_STR_ACTION} ${Coins.QUARTER} ${VM_STR_CHANGE_DISPENSED}`);
    });

    it('Should report a DIME was dispensed', () => {
        coinMechanismDispenseCoinsSimulatorAdapter.dispenseCoin(Coins.DIME);
        expect(terminalOutput[0]).toContain(`${VM_STR_ACTION} ${Coins.DIME} ${VM_STR_CHANGE_DISPENSED}`);
    });

    it('Should report a NICKEL was dispensed', () => {
        coinMechanismDispenseCoinsSimulatorAdapter.dispenseCoin(Coins.NICKEL);
        expect(terminalOutput[0]).toContain(`${VM_STR_ACTION} ${Coins.NICKEL} ${VM_STR_CHANGE_DISPENSED}`);
    });
});

class TerminalSpy implements TerminalInterface {
    output(str: string): void {
      terminalOutput.push(str);
    }
  }
