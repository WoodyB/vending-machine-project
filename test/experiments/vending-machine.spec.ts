import { VendingMachine } from '../../src/VendingMachine';
import { CoinMechanismInsertedCoinsSimulatorAdapter } from '../../src/CoinMechanismAdapters/CoinMechanismInsertedCoinsSimulatorAdapter';
import { DisplaySimulatorAdapter } from '../../src/DisplayAdapters/DisplaySimulatorAdapter';
import { SystemSimulatorAdapter } from '../../src/SystemAdapters/SystemSimulatorAdapter';
import { Simulator } from '../../src/Simulator/Simulator';
import { Terminal } from '../../src/Simulator/Terminal';
import { delay } from '../../src/utils/delay';

const TIMEOUT = 100;

class SimulatedKeyboardInputHandler {
    constructor(private simulator: Simulator) {}
  
    simulateKeyPress(str: string): Promise<string> {
      return new Promise(resolve => {
        this.simulator.handleKeyPress(str, { sequence: str, name: str, ctrl: false, meta:false, shift:false });
        resolve(str);
      });
    }
  }

  class MockConsole {
    private stringsDisplayed: string[];
  
    constructor() {
      this.stringsDisplayed = [];
    }

    public log(str: string): void {
      this.stringsDisplayed.push(str);
    }
    
    public getStringsDisplayed(): string[] {
        return this.stringsDisplayed;
    }
}

let originalConsoleLog: (str: string) => void;
let coinMechanismInsertedCoinsSimulatorAdapter: CoinMechanismInsertedCoinsSimulatorAdapter;
let terminal: Terminal;
let displaySimulatorAdapter: DisplaySimulatorAdapter;
let systemSimulatorAdapter: SystemSimulatorAdapter;
let simulator: Simulator;
let mockConsole: MockConsole; 
let simulatedKeyboardInputHandler: SimulatedKeyboardInputHandler;

describe('Vending Machine', () => {   
    beforeEach(() => {
      mockConsole = new MockConsole();
      originalConsoleLog = console.log;
      console.log = mockConsole.log.bind(mockConsole);
      coinMechanismInsertedCoinsSimulatorAdapter = new CoinMechanismInsertedCoinsSimulatorAdapter();
      terminal = new Terminal();
      displaySimulatorAdapter = new DisplaySimulatorAdapter(terminal);
      systemSimulatorAdapter = new SystemSimulatorAdapter();
      
      simulator = new Simulator(terminal, coinMechanismInsertedCoinsSimulatorAdapter, systemSimulatorAdapter);
      simulator.stop = fakeSimulatorStop;
              
      new VendingMachine(displaySimulatorAdapter, coinMechanismInsertedCoinsSimulatorAdapter, systemSimulatorAdapter);
      simulatedKeyboardInputHandler = new SimulatedKeyboardInputHandler(simulator);
    });

    afterEach( async () => {
      await simulatedKeyboardInputHandler.simulateKeyPress('x');
      await delay(1000);
      console.log = originalConsoleLog;
      });

    it('Should stat up and display Insert Coin', async () => {
      const foundInsertCoin = await waitForVendingMachineToDisplay('DISPLAY: Insert Coin');
      expect(foundInsertCoin).toBe(true);
    });      
    
    it('Should display 0.25 after a quarter is inserted', async () => {
        await waitForVendingMachineToDisplay('DISPLAY: Insert Coin');
        await simulatedKeyboardInputHandler.simulateKeyPress('q');
        await simulatedKeyboardInputHandler.simulateKeyPress('\r');
        const foundDisplay25Cents = await waitForVendingMachineToDisplay('DISPLAY: 0.25');
        expect(foundDisplay25Cents).toBe(true);
    });
});

function fakeSimulatorStop(): void {
    return;
  }
  
async function waitForVendingMachineToDisplay(expectedDisplayOutput: string): Promise<boolean> {
  let count = TIMEOUT;

  while (count > 0) {
    const stringsDisplayed = mockConsole.getStringsDisplayed();
    if (stringsDisplayed.includes(expectedDisplayOutput)) {
      return true;
    }
    await delay(50);
    count--;
  }
  return false;
}
