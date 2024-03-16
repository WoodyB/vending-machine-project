/* 
** Main entry into application
** Until there's a real Vending Machine (probably never) we will be shipping with a simulator
** This is why we are importing simulator adapters below
*/
import { VendingMachine } from './VendingMachine';
import { CoinMechanismInsertedCoinsSimulatorAdapter } from './CoinMechanismAdapters/CoinMechanismInsertedCoinsSimulatorAdapter';

const coinMechanismInsertedCoinsAdapter = new CoinMechanismInsertedCoinsSimulatorAdapter();
const vendingMachine = new VendingMachine(console.log, coinMechanismInsertedCoinsAdapter);

vendingMachine.start();
