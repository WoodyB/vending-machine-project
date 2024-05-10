import { Coins, Products } from '../../../src/types';

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
    
    public async selectProduct(product: Products): Promise<void> {
        this.failWithMethodNotImplemented(`selectProduct(${product})`);
    }

    public async returnCoins(): Promise<void> {
        this.failWithMethodNotImplemented('returnsCoins())');
    }

    public async simulateProductEmptyEvent(product: Products): Promise<void> {
        this.failWithMethodNotImplemented(`simulateProductEmptyEvent(${product})`);
    }

    public async verifyDisplayOutput(str: string): Promise<boolean> {
        this.failWithMethodNotImplemented(`verifyDisplayOutput(${str}))`);
        return false;
    }

    public clearSavedDisplayOutputMessages(): void {
        this.failWithMethodNotImplemented(`clearSavedDisplayOutputMessages()`);
    }

    public clearSavedActionOutputMessages(): void {
        this.failWithMethodNotImplemented(`clearSavedActionOutputMessages()`);
    }

    public clearSavedAllOutputMessages(): void {
        this.failWithMethodNotImplemented(`clearSavedAllOutputMessages()`);
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
