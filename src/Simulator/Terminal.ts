import { TerminalInterface } from './interfaces';

export class Terminal implements TerminalInterface {
    output(str: string): void {
      console.log(str);
    }
  }
  