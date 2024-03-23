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
      if (this.isAlphanumeric(key.sequence)) {
        process.stdout.write(key.sequence);
      }
      if (key.sequence === '\r') {
        process.stdout.write('\n');
      }
      this.simulator.handleKeyPress(str, key);
    });    
  }

  private isAlphanumeric(str: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(str);
  }
}
