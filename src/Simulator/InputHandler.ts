import * as readline from 'readline';
import * as process from 'node:process';
import { Simulator } from './Simulator';

export class InputHandler {
  constructor(private simulator: Simulator) { 
    readline.emitKeypressEvents(process.stdin);

    if (process.stdin.setRawMode != null) {
      process.stdin.setRawMode(true);
    }

    process.stdin.on('keypress', (str, key) => {
      this.simulator.handleKeyPress(str, key);
    });    
  }
}
