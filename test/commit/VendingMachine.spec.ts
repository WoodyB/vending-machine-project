import { VendingMachine } from '../../src/VendingMachine';
let lastStringDisplayed: string;

describe('Vending Machine', () => {
    const vendingMachine = new VendingMachine(myDisplay);

    it('Should display Hello world', () => {
      vendingMachine.start();  
      expect(lastStringDisplayed).toBe('Hello World');
    });
});

function myDisplay(str: string) {
    lastStringDisplayed = str;
}
