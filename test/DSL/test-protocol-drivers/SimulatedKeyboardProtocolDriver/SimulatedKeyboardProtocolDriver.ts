import { BaseDriver } from '../../bases/BaseDriver';
import { Coins } from '../../../../src/types';
import { CoinMechanismInsertedCoinsSimulatorAdapter } from '../../../../src/CoinMechanismAdapters/CoinMechanismInsertedCoinsSimulatorAdapter';
import { DisplaySimulatorAdapter } from '../../../../src/DisplayAdapters/DisplaySimulatorAdapter';
import { SystemSimulatorAdapter } from '../../../../src/SystemAdapters/SystemSimulatorAdapter';
import { Simulator } from '../../../../src/Simulator/Simulator';
import { FakeTerminal } from './FakeTerminal';
import { SimulatedKeyboardInputHandler } from './SimulateKeyboardInputHandler';
import { VendingMachine } from '../../../../src/VendingMachine';
import { delay } from '../../../../src/utils/delay';
import {VM_STR_INSERT_COIN, VM_STR_DISPLAY } from '../../../../src/constants/vending-machine-strings';


export class SimulatedKeyboardDriver extends BaseDriver {
    private coinMechanismInsertedCoinsSimulatorAdapter!: CoinMechanismInsertedCoinsSimulatorAdapter;
    private displaySimulatorAdapter!: DisplaySimulatorAdapter;
    private systemSimulatorAdapter!: SystemSimulatorAdapter;
    private simulator!: Simulator;
    private fakeTerminal!: FakeTerminal;
    private simulatedKeyboardInputHandler!: SimulatedKeyboardInputHandler;
    private TIMEOUT: number = 100;

    private coinKeyMap: Record<Coins, string> = {
        [Coins.QUARTER]: 'q',
        [Coins.DIME]: 'd',
        [Coins.NICKEL]: 'n',
        [Coins.NO_COIN]: '',
        [Coins.PENNY]: 'p',
        [Coins.SLUG]: 's',
        [Coins.FOREIGN_COIN]: 'f'
    };

    constructor() {
        super();
    }

    public override async setup(): Promise<void> {
        this.fakeTerminal = new FakeTerminal();
        this.coinMechanismInsertedCoinsSimulatorAdapter = new CoinMechanismInsertedCoinsSimulatorAdapter(this.fakeTerminal);
        this.displaySimulatorAdapter = new DisplaySimulatorAdapter(this.fakeTerminal);
        this.systemSimulatorAdapter = new SystemSimulatorAdapter();

        this.simulator = new Simulator(this.fakeTerminal, this.coinMechanismInsertedCoinsSimulatorAdapter, this.systemSimulatorAdapter);
        this.simulator.stop = this.fakeSimulatorStop;

        new VendingMachine(this.displaySimulatorAdapter, this.coinMechanismInsertedCoinsSimulatorAdapter, this.systemSimulatorAdapter);
        this.simulatedKeyboardInputHandler = new SimulatedKeyboardInputHandler(this.simulator);
    }

    public override async teardown(): Promise<void> {
        await this.simulatedKeyboardInputHandler.simulateKeyPress('x');
        await delay(1000);
    }

    public override async insertCoin(coin: Coins): Promise<void> {
        await this.waitForVendingMachineToDisplay(`${VM_STR_DISPLAY} ${VM_STR_INSERT_COIN}`);

        const coinKey = this.coinKeyMap[coin];
        if (coinKey) {
            await this.simulatedKeyboardInputHandler.simulateKeyPress(coinKey);
        }

        await this.simulatedKeyboardInputHandler.simulateKeyPress('\r');
    }

    public override async verifyDisplayOutput(str: string): Promise<boolean> {
        return this.waitForVendingMachineToDisplay(`${VM_STR_DISPLAY} ${str}`);
    }

    private fakeSimulatorStop(): void {
        return;
    }

    private async waitForVendingMachineToDisplay(expectedDisplayOutput: string): Promise<boolean> {
        let count = this.TIMEOUT;

        while (count > 0) {
            const stringsDisplayed = this.fakeTerminal.getStringsDisplayed();
            if (stringsDisplayed.includes(expectedDisplayOutput)) {
                return true;
            }
            await delay(50);
            count--;
        }
        return false;
    }
}
