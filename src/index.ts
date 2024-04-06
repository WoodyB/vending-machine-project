/* 
** Main entry into application
** Until there's a real Vending Machine (probably never) we will be shipping the simulator as the product
** This is why we are importing simulator adapters below
*/
import { VendingMachine } from './VendingMachine';
import { CoinMechanismInsertedCoinsSimulatorAdapter } from './CoinMechanismAdapters/CoinMechanismInsertedCoinsSimulatorAdapter';
import { DisplaySimulatorAdapter } from './DisplayAdapters/DisplaySimulatorAdapter';
import { SystemSimulatorAdapter } from './SystemAdapters/SystemSimulatorAdapter';
import { InputHandler } from './Simulator/InputHandler';
import { Simulator } from './Simulator/Simulator';
import { Terminal } from './Simulator/Terminal';
import { VendingMechanismProductSelectSimulatorAdapter } from './VendingMechanismAdapters/VendingMechanismProductSelectSimulatorAdapter';
import { VendingMechanismProductDispenseSimulatorAdapter } from './VendingMechanismAdapters/VendingMechanismProductDispenseSimulatorAdapter';

const terminal = new Terminal();
const coinMechanismInsertedCoinsSimulatorAdapter = new CoinMechanismInsertedCoinsSimulatorAdapter(terminal);
const displaySimulatorAdapter = new DisplaySimulatorAdapter(terminal);
const systemSimulatorAdapter = new SystemSimulatorAdapter();
const vendingMechanismProductSelectSimulatorAdapter = new VendingMechanismProductSelectSimulatorAdapter();
const vendingMechanismProductDispenseSimulatorAdapter = new VendingMechanismProductDispenseSimulatorAdapter(terminal);
const simulator = new Simulator(
    terminal,
    coinMechanismInsertedCoinsSimulatorAdapter,
    systemSimulatorAdapter,
    vendingMechanismProductSelectSimulatorAdapter
);

new VendingMachine(
    displaySimulatorAdapter,
    coinMechanismInsertedCoinsSimulatorAdapter,
    vendingMechanismProductSelectSimulatorAdapter,
    vendingMechanismProductDispenseSimulatorAdapter,
    systemSimulatorAdapter
);
new InputHandler(simulator);

