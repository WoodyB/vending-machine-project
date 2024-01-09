export class VendingMachine {
    constructor(private display: (str: string) => void) {
    }
    public start() {
        this.display('Hello world');
    }
}

const vendingMachine = new VendingMachine(console.log);
vendingMachine.start();

