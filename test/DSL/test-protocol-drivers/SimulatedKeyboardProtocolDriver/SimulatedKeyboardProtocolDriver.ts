import { BaseDriver } from '../../bases/BaseDriver';
import { Coins, Products } from '../../../../src/types';
import { CoinMechanismInsertedCoinsSimulatorAdapter } from '../../../../src/CoinMechanismAdapters/CoinMechanismInsertedCoinsSimulatorAdapter';
import { VendingMechanismProductSelectSimulatorAdapter } from '../../../../src/VendingMechanismAdapters/VendingMechanismProductSelectSimulatorAdapter'
import { VendingMechanismProductDispenseSimulatorAdapter } from '../../../../src/VendingMechanismAdapters/VendingMechanismProductDispenseSimulatorAdapter'
import { DisplaySimulatorAdapter } from '../../../../src/DisplayAdapters/DisplaySimulatorAdapter';
import { SystemSimulatorAdapter } from '../../../../src/SystemAdapters/SystemSimulatorAdapter';
import { Simulator } from '../../../../src/Simulator/Simulator';
import { FakeTerminal } from './FakeTerminal';
import { SimulatedKeyboardInputHandler } from './SimulateKeyboardInputHandler';
import { VendingMachine } from '../../../../src/VendingMachine';
import { delay } from '../../../../src/utils/delay';
import {
    VM_STR_INSERT_COIN,
    VM_STR_DISPLAY,
    VM_STR_ACTION
} from '../../../../src/constants/vending-machine-strings';


export class SimulatedKeyboardDriver extends BaseDriver {
    private coinMechanismInsertedCoinsSimulatorAdapter!: CoinMechanismInsertedCoinsSimulatorAdapter;
    private vendingMechanismProductSelectSimulatorAdapter!: VendingMechanismProductSelectSimulatorAdapter;
    private vendingMechanismProductDispenseSimulatorAdapter!: VendingMechanismProductDispenseSimulatorAdapter;
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
    private productKeyMap: Record<Products, string> = {
        [Products.COLA]: 'a',
        [Products.CHIPS]: 'b',
        [Products.CANDY]: 'c',
        [Products.NO_PRODUCT]: ''
    };

    constructor() {
        super();
    }

    public override async setup(): Promise<void> {
        this.fakeTerminal = new FakeTerminal();
        this.coinMechanismInsertedCoinsSimulatorAdapter = new CoinMechanismInsertedCoinsSimulatorAdapter(this.fakeTerminal);
        this.displaySimulatorAdapter = new DisplaySimulatorAdapter(this.fakeTerminal);
        this.systemSimulatorAdapter = new SystemSimulatorAdapter();
        this.vendingMechanismProductSelectSimulatorAdapter = new VendingMechanismProductSelectSimulatorAdapter();
        this.vendingMechanismProductDispenseSimulatorAdapter = new VendingMechanismProductDispenseSimulatorAdapter(this.fakeTerminal);

        this.simulator = new Simulator(
            this.fakeTerminal,
            this.coinMechanismInsertedCoinsSimulatorAdapter,
            this.systemSimulatorAdapter,
            this.vendingMechanismProductSelectSimulatorAdapter
        );
        this.simulator.stop = this.fakeSimulatorStop;

        new VendingMachine(
            this.displaySimulatorAdapter,
            this.coinMechanismInsertedCoinsSimulatorAdapter,
            this.vendingMechanismProductSelectSimulatorAdapter,
            this.vendingMechanismProductDispenseSimulatorAdapter,
            this.systemSimulatorAdapter
        );
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

    public override async selectProduct(product: Products): Promise<void> {
        await this.waitForVendingMachineToDisplay(`${VM_STR_DISPLAY}`);

        const productKey = this.productKeyMap[product];
        if (productKey) {
            await this.simulatedKeyboardInputHandler.simulateKeyPress(productKey);
        }

        await this.simulatedKeyboardInputHandler.simulateKeyPress('\r');
    }

    public override async verifyDisplayOutput(str: string): Promise<boolean> {
        return this.waitForVendingMachineToDisplay(`${VM_STR_DISPLAY} ${str}`);
    }

    public override async verifyActionOutput(str: string): Promise<boolean> {
        return this.waitForVendingMachineToDisplay(`${VM_STR_ACTION} ${str}`);
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
