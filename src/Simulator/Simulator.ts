import { CoinMechanismInsertedCoinsInterface, SystemInterface} from '../interfaces';
import { TerminalInterface } from './interfaces';
import { Coins, SystemEvents } from '../types'
import { Keys, KeyHandler } from './types';
import { delay } from '../utils/delay';
import { SIM_STR_SHUTTING_DOWN, SIM_STR_STARTED } from './constants';

export class Simulator {
    private terminal: TerminalInterface;
    private coinMechanismAdapter: CoinMechanismInsertedCoinsInterface;
    private systemAdapter: SystemInterface;
    private previousKey: Keys;
    private currentKey: Keys;
    private deferredKeyFunctionMap: { [key: string]: KeyHandler } = {};
    private immediateKeyFunctionMap: { [key: string]: KeyHandler } = {};


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(terminal: TerminalInterface,
        coinMechanismAdapter: CoinMechanismInsertedCoinsInterface,
        systemAdapter: SystemInterface) {
        this.deferredKeyFunctionMap[Keys.Q] = this.Q_KeyHandler.bind(this);
        this.deferredKeyFunctionMap[Keys.D] = this.D_KeyHandler.bind(this);
        this.deferredKeyFunctionMap[Keys.N] = this.N_KeyHandler.bind(this);
        this.deferredKeyFunctionMap[Keys.P] = this.P_KeyHandler.bind(this);
        this.deferredKeyFunctionMap[Keys.S] = this.S_KeyHandler.bind(this);
        this.deferredKeyFunctionMap[Keys.F] = this.F_KeyHandler.bind(this);

        this.immediateKeyFunctionMap[Keys.X] = this.exitSimulator.bind(this);
        this.immediateKeyFunctionMap[Keys.ESC] = this.exitSimulator.bind(this);
        this.immediateKeyFunctionMap[Keys.CTL_C] = this.exitSimulator.bind(this);
        this.immediateKeyFunctionMap[Keys.ENTER] = this.ENTER_KeyHandler.bind(this);
        
        this.terminal = terminal;
        this.coinMechanismAdapter = coinMechanismAdapter;
        this.systemAdapter = systemAdapter;
        this.previousKey = Keys.NO_KEY;
        this.currentKey = Keys.NO_KEY;
        this.terminal.output(SIM_STR_STARTED);
        this.systemAdapter.reportSystemEvent(SystemEvents.POWER_ON);    
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    public async handleKeyPress(str: string, key: any): Promise<void> {        
        this.currentKey = key.sequence;
        this.executeKeyHandlerImmediate(this.currentKey);
        this.previousKey = this.currentKey;
    }

    public stop(): void {
        process.exit(0);
    }

    private async Q_KeyHandler(): Promise<void> {
        this.coinMechanismAdapter.insertCoin(Coins.QUARTER);
    }

    private async D_KeyHandler(): Promise<void> {
        this.coinMechanismAdapter.insertCoin(Coins.DIME);
    }

    private async N_KeyHandler(): Promise<void> {
        this.coinMechanismAdapter.insertCoin(Coins.NICKEL);
    }

    private async P_KeyHandler(): Promise<void> {
        this.coinMechanismAdapter.insertCoin(Coins.PENNY);
    }

    private async S_KeyHandler(): Promise<void> {
        this.coinMechanismAdapter.insertCoin(Coins.SLUG);
    }

    private async F_KeyHandler(): Promise<void> {
        this.coinMechanismAdapter.insertCoin(Coins.FOREIGN_COIN);
    }

    private async exitSimulator(): Promise<void> {
        this.terminal.output(`\n${SIM_STR_SHUTTING_DOWN}`);
        process.removeAllListeners();
        this.systemAdapter.reportSystemEvent(SystemEvents.POWER_DOWN);
        await delay(1000);
        this.stop();
    }

    private async ENTER_KeyHandler(): Promise<void> {
        this.executeKeyHandlerDeferred(this.previousKey);
        this.previousKey = Keys.NO_KEY;
    }

    private executeKeyHandlerDeferred(key: string): void {
        const func = this.deferredKeyFunctionMap[key];
        func?.();
    }
    
    private executeKeyHandlerImmediate(key: string): void {
        const func = this.immediateKeyFunctionMap[key];
        func?.();
    } 
}
