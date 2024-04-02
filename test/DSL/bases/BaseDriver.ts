import { Coins } from '../../../src/types';

export abstract class BaseDriver {
    public async setup(): Promise<void> {
        this.failWithMethodNotImplemented("setup()");
    }

    public async teardown(): Promise<void> {
        this.failWithMethodNotImplemented("teardown()");
    }

    public async insertCoin(coin: Coins): Promise<void> {
        this.failWithMethodNotImplemented(`insertCoin(${coin})`);
    }

    public async verifyDisplayOutput(str: string): Promise<boolean> {
        this.failWithMethodNotImplemented(`verifyDisplayOutput(${str}))`);
        return false;
    }

    public async verifyActionOutput(str: string): Promise<boolean> {
        this.failWithMethodNotImplemented(`verifyActionOutput(${str}))`);
        return false;
    }

    private failWithMethodNotImplemented(methodName: string): void {
        throw new Error(
            `This method ${methodName} has not been implemented for the selected protocol driver`
        );
    }
}
