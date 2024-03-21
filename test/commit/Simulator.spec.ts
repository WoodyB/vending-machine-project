import { Simulator } from '../../src/Simulator/Simulator';
import { CoinMechanismInsertedCoinsInterface } from '../../src/interfaces';
import { Coins } from '../../src/types';
import { TerminalInterface } from '../../src/Simulator/interfaces';
import { Keys } from '../../src/Simulator/types';

let terminalOutput: string[] = [];

describe('Simulator', () => {
  let simulator: Simulator;
  let mockInputHandler: MockInputHandler;
  let mockCoinMechanismInsertedAdapter: MockCoinMechanismInsertedAdapter;
  let mockTerminal: MockTerminal;

  beforeEach(() => {
    mockTerminal = new MockTerminal;
    mockCoinMechanismInsertedAdapter = new MockCoinMechanismInsertedAdapter();
    simulator = new Simulator(mockTerminal, mockCoinMechanismInsertedAdapter);
    mockInputHandler = new MockInputHandler(simulator);
  });
  
  afterEach(() => {
    terminalOutput = [];
  });

  it('should display started message', async () => {
    expect(terminalOutput[0]).toContain('Simulator started');
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

  it('should simulate a FOREIGN Coin inserted when the f key is pressed followed by the enter key', async () => {
    await mockInputHandler.simulateKeyPress(Keys.F);
    await mockInputHandler.simulateKeyPress(Keys.ENTER);
    expect (mockCoinMechanismInsertedAdapter.getLastInsertedCoin()).toBe(Coins.FOREIGN_COIN);
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
    return this.lastInsertedCoin;
  }
}    

class MockTerminal implements TerminalInterface {
  output(str: string): void {
    terminalOutput.push(str);
  }
}
