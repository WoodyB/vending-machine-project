import { appData } from "./app-data";

export class VendingMachine {
    constructor(private display: (str: string) => void) {
    }
    public start() {
        this.display('Hello world');
    }
    public displayVersion() {
        this.display(`Vending Machine Project Version ${appData.version}`);
    }
}