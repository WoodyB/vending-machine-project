import { VendingMachine } from '../../src/VendingMachine';
let lastStringDisplayed: string;

describe('Vending Machine', () => {
    const vendingMachine = new VendingMachine(myDisplay);

    it('Should display Hello world', () => {
      vendingMachine.start();
      // Break test so we can test ci workflow  
      expect(lastStringDisplayed).toBe('XHello world');
    });
});

function myDisplay(str: string) {
    lastStringDisplayed = str;
}
