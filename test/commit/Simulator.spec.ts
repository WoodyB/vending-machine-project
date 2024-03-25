import { Simulator } from '../../src/Simulator/Simulator';
import { CoinMechanismInsertedCoinsInterface } from '../../src/interfaces';
import { Coins } from '../../src/types';
import { TerminalInterface } from '../../src/Simulator/interfaces';
import { Keys } from '../../src/Simulator/types';
import { SystemEvents } from '../../src/types';
import { SystemInterface} from '../../src/interfaces'
import { SIM_STR_SHUTTING_DOWN, SIM_STR_STARTED } from '../../src/Simulator/constants';

let terminalOutput: string[] = [];

describe('Simulator', () => {
  let simulator: Simulator;
  let mockInputHandler: MockInputHandler;
  let mockCoinMechanismInsertedAdapter: MockCoinMechanismInsertedAdapter;
  let mockTerminal: MockTerminal;
  let mockSystemAdapter: MockSystemAdapter;

  beforeEach(() => {
    mockTerminal = new MockTerminal;
    mockCoinMechanismInsertedAdapter = new MockCoinMechanismInsertedAdapter();
    mockSystemAdapter = new MockSystemAdapter();
    simulator = new Simulator(mockTerminal, mockCoinMechanismInsertedAdapter, mockSystemAdapter);
    mockInputHandler = new MockInputHandler(simulator);
    simulator.stop = fakeSimulatorStop;
  });
  
  afterEach(() => {
    terminalOutput = [];
  });

  it('should display started message', async () => {
    expect(terminalOutput[0]).toContain(SIM_STR_STARTED);
  });

  it('should start up the Vending Machine FSM', async () => {
    expect (mockSystemAdapter.readSystemEvent()).toBe(SystemEvents.POWER_ON);
  });
  
  it('should ignore the y key when pressed followed by the enter key', async () => {
    await mockInputHandler.simulateKeyPress('y');
    await mockInputHandler.simulateKeyPress(Keys.ENTER);
    expect (mockCoinMechanismInsertedAdapter.getLastInsertedCoin()).toBe(Coins.NO_COIN);
  });

  it('should not process a coin keys unless the enter key is pressed after it', async () => {
    await mockInputHandler.simulateKeyPress(Keys.Q);
    expect (mockCoinMechanismInsertedAdapter.getLastInsertedCoin()).toBe(Coins.NO_COIN);
  });

  it('should simulate a QUARTER inserted when the q key is pressed followed by the enter key', async () => {
    await mockInputHandler.simulateKeyPress(Keys.Q);
    await mockInputHandler.simulateKeyPress(Keys.ENTER);
    expect (mockCoinMechanismInsertedAdapter.getLastInsertedCoin()).toBe(Coins.QUARTER);
  });

  it('should simulate a DIME inserted when the q key is pressed 3 times followed by d and the enter key', async () => {
    await mockInputHandler.simulateKeyPress(Keys.Q);
    await mockInputHandler.simulateKeyPress(Keys.Q);
    await mockInputHandler.simulateKeyPress(Keys.Q);

    await mockInputHandler.simulateKeyPress(Keys.D);
    await mockInputHandler.simulateKeyPress(Keys.ENTER);
    expect (mockCoinMechanismInsertedAdapter.getLastInsertedCoin()).toBe(Coins.DIME);
  });

  it('should simulate a NICKEL inserted when the n key is pressed followed by the enter key', async () => {
    await mockInputHandler.simulateKeyPress(Keys.N);
    await mockInputHandler.simulateKeyPress(Keys.ENTER);
    expect (mockCoinMechanismInsertedAdapter.getLastInsertedCoin()).toBe(Coins.NICKEL);
  });

  it('should simulate a PENNY inserted when the p key is pressed followed by the enter key', async () => {
    await mockInputHandler.simulateKeyPress(Keys.P);
    await mockInputHandler.simulateKeyPress(Keys.ENTER);
    expect (mockCoinMechanismInsertedAdapter.getLastInsertedCoin()).toBe(Coins.PENNY);
  });

  it('should simulate a SLUG inserted when the s key is pressed followed by the enter key', async () => {
    await mockInputHandler.simulateKeyPress(Keys.S);
    await mockInputHandler.simulateKeyPress(Keys.ENTER);
    expect (mockCoinMechanismInsertedAdapter.getLastInsertedCoin()).toBe(Coins.SLUG);
  });

  it('should simulate a FOREIGN COIN inserted when the f key is pressed followed by the enter key', async () => {
    await mockInputHandler.simulateKeyPress(Keys.F);
    await mockInputHandler.simulateKeyPress(Keys.ENTER);
    expect (mockCoinMechanismInsertedAdapter.getLastInsertedCoin()).toBe(Coins.FOREIGN_COIN);
  });

  it('should not continue to use the last input coin if enter is repeated', async () => {
    await mockInputHandler.simulateKeyPress(Keys.Q);
    await mockInputHandler.simulateKeyPress(Keys.ENTER);
    expect (mockCoinMechanismInsertedAdapter.getLastInsertedCoin()).toBe(Coins.QUARTER);
    await mockInputHandler.simulateKeyPress(Keys.ENTER);
    expect (mockCoinMechanismInsertedAdapter.getLastInsertedCoin()).toBe(Coins.NO_COIN);
  });

  it('should power down Vending Machine if the x key is pressed', async () => {
    await mockInputHandler.simulateKeyPress(Keys.X);
    expect (mockSystemAdapter.readSystemEvent()).toBe(SystemEvents.POWER_DOWN);
  });

  it('should power down Vending Machine if the Esc key is pressed', async () => {
    await mockInputHandler.simulateKeyPress(Keys.ESC);
    expect (mockSystemAdapter.readSystemEvent()).toBe(SystemEvents.POWER_DOWN);
  });

  it('should power down Vending Machine if CTL C keys are pressed', async () => {
    await mockInputHandler.simulateKeyPress(Keys.CTL_C);
    expect (mockSystemAdapter.readSystemEvent()).toBe(SystemEvents.POWER_DOWN);
  });

  it('should display it is shutting down when the x key is pressed', async () => {
    await mockInputHandler.simulateKeyPress(Keys.X);
    expect(terminalOutput[1]).toContain(SIM_STR_SHUTTING_DOWN);
  });

});

class MockInputHandler {
  constructor(private simulator: Simulator) {}

  simulateKeyPress(str: string): Promise<string> {
    return new Promise(resolve => {
      this.simulator.handleKeyPress(str, { sequence: str, name: str, ctrl: false, meta:false, shift:false });
      resolve(str);
    });
  }
}

class MockSystemAdapter implements SystemInterface {
  private lastEvent: SystemEvents;

  constructor() {
    this.lastEvent = SystemEvents.NO_EVENT;
  }

  public readSystemEvent(): SystemEvents {
    return this.lastEvent;
}

  public reportSystemEvent(event: SystemEvents): void {
    this.lastEvent = event;
  }
}

class MockCoinMechanismInsertedAdapter implements CoinMechanismInsertedCoinsInterface{
  private lastInsertedCoin: Coins;

  constructor() {
    this.lastInsertedCoin= Coins.NO_COIN;
  }

  public insertCoin(coin: Coins): void {
    this.lastInsertedCoin = coin;
  }

  public readPendingTransactionTotal(): number {
    return 0;
  }

  public getLastInsertedCoin(): Coins {
    const lastInsertedCoin = this.lastInsertedCoin;

    /* Intended Destructive Read */
    this.lastInsertedCoin = Coins.NO_COIN;
    return lastInsertedCoin;
  }
}    

class MockTerminal implements TerminalInterface {
  output(str: string): void {
    terminalOutput.push(str);
  }
}

function fakeSimulatorStop(): void {
  return;
}
