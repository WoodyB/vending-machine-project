/* 
** Main entry into application
** Until there's a real Vending Machine (probably never) we will be shipping with a simulator
** This is why we are importing simulator adapters below
*/
import { VendingMachine } from './VendingMachine';
import { CoinMechanismInsertedCoinsSimulatorAdapter } from './CoinMechanismAdapters/CoinMechanismInsertedCoinsSimulatorAdapter';
import { DisplaySimulatorAdapter } from './DisplayAdapters/DisplaySimulatorAdapter';
import { SystemSimulatorAdapter } from './SystemAdapters/SystemSimulatorAdapter';
import { InputHandler } from './Simulator/InputHandler';
import { Simulator } from './Simulator/Simulator';
import { Terminal } from './Simulator/Terminal';

const terminal = new Terminal();
const coinMechanismInsertedCoinsSimulatorAdapter = new CoinMechanismInsertedCoinsSimulatorAdapter(terminal);
const displaySimulatorAdapter = new DisplaySimulatorAdapter(terminal);
const systemSimulatorAdapter = new SystemSimulatorAdapter();
const simulator = new Simulator(terminal, coinMechanismInsertedCoinsSimulatorAdapter, systemSimulatorAdapter);

new VendingMachine(displaySimulatorAdapter, coinMechanismInsertedCoinsSimulatorAdapter, systemSimulatorAdapter);
new InputHandler(simulator);

