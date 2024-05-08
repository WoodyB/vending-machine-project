import { BaseDriver } from '../../bases/BaseDriver';
import { Coins, Products } from '../../../../src/types';
import { CoinMechanismInsertedCoinsSimulatorAdapter } from '../../../../src/CoinMechanismAdapters/CoinMechanismInsertedCoinsSimulatorAdapter';
import { CoinMechanismDispenseCoinsSimulatorAdapter } from '../../../../src/CoinMechanismAdapters/CoinMechanismDispenseCoinsSimulatorAdapter'
import { VendingMechanismProductSelectSimulatorAdapter } from '../../../../src/VendingMechanismAdapters/VendingMechanismProductSelectSimulatorAdapter'
import { VendingMechanismProductDispenseSimulatorAdapter } from '../../../../src/VendingMechanismAdapters/VendingMechanismProductDispenseSimulatorAdapter'
import { DisplaySimulatorAdapter } from '../../../../src/DisplayAdapters/DisplaySimulatorAdapter';
import { SystemSimulatorAdapter } from '../../../../src/SystemAdapters/SystemSimulatorAdapter';
import { Simulator } from '../../../../src/Simulator/Simulator';
import { FakeTerminal } from './FakeTerminal';
import { SimulatedKeyboardInputHandler } from './SimulateKeyboardInputHandler';
import { CurrencyHandler } from '../../../../src/CurrencyHandler';
import { VendingHandler } from '../../../../src/VendingHandler';
import { VendingMachine } from '../../../../src/VendingMachine';
import { delay } from '../../../../src/utils/delay';
import {
    VM_STR_INSERT_COIN,
    VM_STR_DISPLAY,
    VM_STR_ACTION
} from '../../../../src/constants/vending-machine-strings';


export class SimulatedKeyboardDriver extends BaseDriver {
    private coinMechanismInsertedCoinsSimulatorAdapter!: CoinMechanismInsertedCoinsSimulatorAdapter;
    private coinMechanismDispenseCoinsSimulatorAdapter!: CoinMechanismDispenseCoinsSimulatorAdapter;
    private currencyHandler!: CurrencyHandler;
    private vendingMechanismProductSelectSimulatorAdapter!: VendingMechanismProductSelectSimulatorAdapter;
    private vendingMechanismProductDispenseSimulatorAdapter!: VendingMechanismProductDispenseSimulatorAdapter;
    private vendingHandler!: VendingHandler;
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
        [Products.CANDY]: 'b',
        [Products.CHIPS]: 'c',
        [Products.NO_PRODUCT]: ''
    };
    private outOfStockKeyMap: Record<Products, string> = {
        [Products.COLA]: '1',
        [Products.CANDY]: '2',
        [Products.CHIPS]: '3',
        [Products.NO_PRODUCT]: ''
    }

    constructor() {
        super();
    }

    public override async setup(): Promise<void> {
        this.fakeTerminal = new FakeTerminal();
        this.coinMechanismInsertedCoinsSimulatorAdapter = new CoinMechanismInsertedCoinsSimulatorAdapter(this.fakeTerminal);
        this.coinMechanismDispenseCoinsSimulatorAdapter = new CoinMechanismDispenseCoinsSimulatorAdapter(this.fakeTerminal);
        this.currencyHandler = new CurrencyHandler(this.coinMechanismInsertedCoinsSimulatorAdapter, this.coinMechanismDispenseCoinsSimulatorAdapter);
        this.displaySimulatorAdapter = new DisplaySimulatorAdapter(this.fakeTerminal);
        this.systemSimulatorAdapter = new SystemSimulatorAdapter();
        this.vendingMechanismProductSelectSimulatorAdapter = new VendingMechanismProductSelectSimulatorAdapter(this.fakeTerminal);
        this.vendingMechanismProductDispenseSimulatorAdapter = new VendingMechanismProductDispenseSimulatorAdapter(this.fakeTerminal);
        this.vendingHandler = new VendingHandler(this.vendingMechanismProductSelectSimulatorAdapter, this.vendingMechanismProductDispenseSimulatorAdapter);

        this.simulator = new Simulator(
            this.fakeTerminal,
            this.coinMechanismInsertedCoinsSimulatorAdapter,
            this.systemSimulatorAdapter,
            this.vendingMechanismProductSelectSimulatorAdapter
        );
        this.simulator.stop = this.fakeSimulatorStop;

        new VendingMachine(
            this.displaySimulatorAdapter,
            this.currencyHandler,
            this.vendingHandler,
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
        // This works but it's not optimal. What would be better maybe is
        // waiting for the fake terminal to display "DISPLAY: x.xx"
        await delay(200);
    }

    public override async selectProduct(product: Products): Promise<void> {
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

    public override async returnCoins(): Promise<void> {
        await this.simulatedKeyboardInputHandler.simulateKeyPress('r');
        await this.simulatedKeyboardInputHandler.simulateKeyPress('\r');    
    }

    public override async simulateProductEmptyEvent(product: Products): Promise<void> {
        const outOfStockKey = this.outOfStockKeyMap[product];
        if (outOfStockKey) {
            await this.simulatedKeyboardInputHandler.simulateKeyPress(outOfStockKey);
        }

        await this.simulatedKeyboardInputHandler.simulateKeyPress('\r');
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
