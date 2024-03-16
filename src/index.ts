/* 
** Main entry into application
** Until there's a real Vending Machine (probably never) we will be shipping with a simulator
** This is why we are importing simulator adapters below
*/
import { VendingMachine } from './VendingMachine';
import { CoinMechanismInsertedCoinsSimulatorAdapter } from './CoinMechanismAdapters/CoinMechanismInsertedCoinsSimulatorAdapter';
import { DisplaySimulatorAdapter } from './DisplayAdapters/DisplaySimulatorAdapter';
import { SystemSimulatorAdapter } from './SystemAdapters/SystemSimulatorAdapter';

const coinMechanismInsertedCoinsAdapter = new CoinMechanismInsertedCoinsSimulatorAdapter();
const displaySimulatorAdapter = new DisplaySimulatorAdapter();
const systemSimulatorAdapter = new SystemSimulatorAdapter();
const vendingMachine = new VendingMachine(displaySimulatorAdapter, coinMechanismInsertedCoinsAdapter, systemSimulatorAdapter);

vendingMachine.start();
