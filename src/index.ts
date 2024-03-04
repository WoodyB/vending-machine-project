import { VendingMachine } from './VendingMachine';
import { CoinMechanism } from './CoinMechanism';

const coinMechanism = new CoinMechanism();
const vendingMachine = new VendingMachine(console.log, coinMechanism);

vendingMachine.start();
