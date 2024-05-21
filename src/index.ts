/* 
** Main entry into application
** Until there's a real Vending Machine (probably never) we will be shipping the simulator as the product
** This is why we are importing simulator adapters below
*/
import { appData } from './app-data';
import { VendingMachine } from './VendingMachine';
import { CoinMechanismInsertedCoinsSimulatorAdapter } from './CoinMechanismAdapters/CoinMechanismInsertedCoinsSimulatorAdapter';
import { CoinMechanismDispenseCoinsSimulatorAdapter } from './CoinMechanismAdapters/CoinMechanismDispenseCoinsSimulatorAdapter';
import { DisplaySimulatorAdapter } from './DisplayAdapters/DisplaySimulatorAdapter';
import { SystemSimulatorAdapter } from './SystemAdapters/SystemSimulatorAdapter';
import { InputHandler } from './Simulator/InputHandler';
import { Simulator } from './Simulator/Simulator';
import { Terminal } from './Simulator/Terminal';
import { VendingMechanismProductSelectSimulatorAdapter } from './VendingMechanismAdapters/VendingMechanismProductSelectSimulatorAdapter';
import { VendingMechanismProductDispenseSimulatorAdapter } from './VendingMechanismAdapters/VendingMechanismProductDispenseSimulatorAdapter';
import { CurrencyInventory } from './CurrencyInventory';
import { CurrencyHandler } from './CurrencyHandler';
import { VendingHandler } from './VendingHandler';

const terminal = new Terminal();
const coinMechanismInsertedCoinsSimulatorAdapter = new CoinMechanismInsertedCoinsSimulatorAdapter(terminal);
const coinMechanismDispenseCoinsSimulatorAdapter = new CoinMechanismDispenseCoinsSimulatorAdapter(terminal);
const displaySimulatorAdapter = new DisplaySimulatorAdapter(terminal);
const systemSimulatorAdapter = new SystemSimulatorAdapter();
const vendingMechanismProductSelectSimulatorAdapter = new VendingMechanismProductSelectSimulatorAdapter(terminal);
const vendingMechanismProductDispenseSimulatorAdapter = new VendingMechanismProductDispenseSimulatorAdapter(terminal);
const currencyInventory = new CurrencyInventory({quarters: appData.numberOfQuarters, dimes: appData.numberOfDimes, nickels: appData.numberOfNickels});
const currencyHandler = new CurrencyHandler(coinMechanismInsertedCoinsSimulatorAdapter, coinMechanismDispenseCoinsSimulatorAdapter, currencyInventory);
const vendingHandler = new VendingHandler(vendingMechanismProductSelectSimulatorAdapter, vendingMechanismProductDispenseSimulatorAdapter);
const simulator = new Simulator(
    terminal,
    coinMechanismInsertedCoinsSimulatorAdapter,
    systemSimulatorAdapter,
    vendingMechanismProductSelectSimulatorAdapter
);

new VendingMachine(
    displaySimulatorAdapter,
    currencyHandler,
    vendingHandler,
    systemSimulatorAdapter
);
new InputHandler(simulator);

