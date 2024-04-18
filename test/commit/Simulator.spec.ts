import { Simulator } from '../../src/Simulator/Simulator';
import { CoinMechanismInsertedCoinsInterface } from '../../src/interfaces';
import { VendingMechanismProductSelectInterface } from '../../src/interfaces'; 
import { Coins, Products } from '../../src/types';
import { TerminalInterface } from '../../src/Simulator/interfaces';
import { Keys } from '../../src/Simulator/types';
import { SystemEvents } from '../../src/types';
import { SystemInterface} from '../../src/interfaces'
import {
  SIM_STR_SHUTTING_DOWN,
  SIM_STR_STARTED,
  SIM_STR_INSTRUCTIONS
} from '../../src/Simulator/constants';

let terminalOutput: string[] = [];

describe('Simulator', () => {
  let simulator: Simulator;
  let mockInputHandler: MockInputHandler;
  let mockCoinMechanismInsertedCoinsAdapter: MockCoinMechanismInsertedCoinsAdapter;
  let mockTerminal: MockTerminal;
  let mockSystemAdapter: MockSystemAdapter;
  let mockVendingMechanismProductSelectSimulatorAdapter: MockVendingMechanismProductSelectSimulatorAdapter;

  beforeEach(() => {
    mockTerminal = new MockTerminal;
    mockCoinMechanismInsertedCoinsAdapter = new MockCoinMechanismInsertedCoinsAdapter();
    mockSystemAdapter = new MockSystemAdapter();
    mockVendingMechanismProductSelectSimulatorAdapter = new MockVendingMechanismProductSelectSimulatorAdapter()
    simulator = new Simulator(mockTerminal, mockCoinMechanismInsertedCoinsAdapter, mockSystemAdapter, mockVendingMechanismProductSelectSimulatorAdapter);
    mockInputHandler = new MockInputHandler(simulator);
    simulator.stop = fakeSimulatorStop;
  });
  
  afterEach(() => {
    terminalOutput = [];
  });

  it('should display started message', async () => {
    expect(terminalOutput[0]).toContain(SIM_STR_STARTED);
  });

  it('should display simulator instructions', async () => {
    expect(terminalOutput[1]).toContain(SIM_STR_INSTRUCTIONS);
  });

  it('should start up the Vending Machine FSM', async () => {
    expect (mockSystemAdapter.readSystemEvent()).toBe(SystemEvents.POWER_ON);
  });
  
  it('should ignore the y key when pressed followed by the enter key', async () => {
    await mockInputHandler.simulateKeyPress('y');
    await mockInputHandler.simulateKeyPress(Keys.ENTER);
    expect (mockCoinMechanismInsertedCoinsAdapter.getLastInsertedCoin()).toBe(Coins.NO_COIN);
  });

  it('should not process a coin keys unless the enter key is pressed after it', async () => {
    await mockInputHandler.simulateKeyPress(Keys.Q);
    expect (mockCoinMechanismInsertedCoinsAdapter.getLastInsertedCoin()).toBe(Coins.NO_COIN);
  });

  it('should simulate a QUARTER inserted when the q key is pressed followed by the enter key', async () => {
    await mockInputHandler.simulateKeyPress(Keys.Q);
    await mockInputHandler.simulateKeyPress(Keys.ENTER);
    expect (mockCoinMechanismInsertedCoinsAdapter.getLastInsertedCoin()).toBe(Coins.QUARTER);
  });

  it('should simulate a DIME inserted when the q key is pressed 3 times followed by d and the enter key', async () => {
    await mockInputHandler.simulateKeyPress(Keys.Q);
    await mockInputHandler.simulateKeyPress(Keys.Q);
    await mockInputHandler.simulateKeyPress(Keys.Q);

    await mockInputHandler.simulateKeyPress(Keys.D);
    await mockInputHandler.simulateKeyPress(Keys.ENTER);
    expect (mockCoinMechanismInsertedCoinsAdapter.getLastInsertedCoin()).toBe(Coins.DIME);
  });

  it('should simulate a NICKEL inserted when the n key is pressed followed by the enter key', async () => {
    await mockInputHandler.simulateKeyPress(Keys.N);
    await mockInputHandler.simulateKeyPress(Keys.ENTER);
    expect (mockCoinMechanismInsertedCoinsAdapter.getLastInsertedCoin()).toBe(Coins.NICKEL);
  });

  it('should simulate a PENNY inserted when the p key is pressed followed by the enter key', async () => {
    await mockInputHandler.simulateKeyPress(Keys.P);
    await mockInputHandler.simulateKeyPress(Keys.ENTER);
    expect (mockCoinMechanismInsertedCoinsAdapter.getLastInsertedCoin()).toBe(Coins.PENNY);
  });

  it('should simulate a SLUG inserted when the s key is pressed followed by the enter key', async () => {
    await mockInputHandler.simulateKeyPress(Keys.S);
    await mockInputHandler.simulateKeyPress(Keys.ENTER);
    expect (mockCoinMechanismInsertedCoinsAdapter.getLastInsertedCoin()).toBe(Coins.SLUG);
  });

  it('should simulate a FOREIGN COIN inserted when the f key is pressed followed by the enter key', async () => {
    await mockInputHandler.simulateKeyPress(Keys.F);
    await mockInputHandler.simulateKeyPress(Keys.ENTER);
    expect (mockCoinMechanismInsertedCoinsAdapter.getLastInsertedCoin()).toBe(Coins.FOREIGN_COIN);
  });

  it('should not continue to use the last input coin if enter is repeated', async () => {
    await mockInputHandler.simulateKeyPress(Keys.Q);
    await mockInputHandler.simulateKeyPress(Keys.ENTER);
    expect (mockCoinMechanismInsertedCoinsAdapter.getLastInsertedCoin()).toBe(Coins.QUARTER);
    await mockInputHandler.simulateKeyPress(Keys.ENTER);
    expect (mockCoinMechanismInsertedCoinsAdapter.getLastInsertedCoin()).toBe(Coins.NO_COIN);
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
    expect(terminalOutput[2]).toContain(SIM_STR_SHUTTING_DOWN);
  });

  it('should display simulator instructions when the h key is pressed', async () => {
    await mockInputHandler.simulateKeyPress(Keys.H);
    expect(terminalOutput[2]).toContain(SIM_STR_INSTRUCTIONS);
  });

  it('should simulate product COLA is selected when the a key is pressed followed by the enter key', async () => {
    await mockInputHandler.simulateKeyPress(Keys.A);
    await mockInputHandler.simulateKeyPress(Keys.ENTER);
    expect(mockVendingMechanismProductSelectSimulatorAdapter.readProductSelection()).toBe(Products.COLA);
  });

  it('should simulate product CANDY is selected when the b key is pressed followed by the enter key', async () => {
    await mockInputHandler.simulateKeyPress(Keys.B);
    await mockInputHandler.simulateKeyPress(Keys.ENTER);
    expect(mockVendingMechanismProductSelectSimulatorAdapter.readProductSelection()).toBe(Products.CANDY);
  });

  it('should simulate product CHIPS is selected when the c key is pressed followed by the enter key', async () => {
    await mockInputHandler.simulateKeyPress(Keys.C);
    await mockInputHandler.simulateKeyPress(Keys.ENTER);
    expect(mockVendingMechanismProductSelectSimulatorAdapter.readProductSelection()).toBe(Products.CHIPS);
  });

  it('should simulate coin return when r key is pressed followed by the enter key', async () => {
    await mockInputHandler.simulateKeyPress(Keys.R);
    await mockInputHandler.simulateKeyPress(Keys.ENTER);
    expect(mockCoinMechanismInsertedCoinsAdapter.readReturnCoinsStatus()).toBe(true);
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

class MockCoinMechanismInsertedCoinsAdapter implements CoinMechanismInsertedCoinsInterface{
  private lastInsertedCoin: Coins;
  private returnCoinsStatus = false;

  constructor() {
    this.lastInsertedCoin= Coins.NO_COIN;
  }

  public insertCoin(coin: Coins): void {
    this.lastInsertedCoin = coin;
  }

  public readPendingTransactionTotal(): number {
    return 0;
  }

  resetPendingTransactionTotal(): void {
    return;
  }

  public readInsertedCoin(): Coins {
    return this.lastInsertedCoin;
  }

  public readReturnCoinsStatus(): boolean {
    return this.returnCoinsStatus;
  }
  
  public setReturnCoinsStatusToTrue(): void {
    this.returnCoinsStatus = true;
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

class MockVendingMechanismProductSelectSimulatorAdapter implements VendingMechanismProductSelectInterface {
  private selectedProduct!: Products;

  constructor() {
      this.selectedProduct = Products.NO_PRODUCT;
  }

  public selectProduct(product: Products): void {
      this.selectedProduct = product;
  }

  public readProductSelection(): Products {
      return this.selectedProduct;
  }
}