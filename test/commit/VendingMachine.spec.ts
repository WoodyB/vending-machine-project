import { VendingMachine } from '../../src/VendingMachine';
let lastStringDisplayed: string;

describe('Vending Machine', () => {
    const vendingMachine = new VendingMachine(myDisplay);

    it('Should display Hello world', () => {
      vendingMachine.start();
      // Force test to fail
      expect(lastStringDisplayed).toBe('XHello world');
    });
});

function myDisplay(str: string) {
    lastStringDisplayed = str;
}
