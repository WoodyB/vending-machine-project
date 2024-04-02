import { DisplayInterface } from '../interfaces'
import { Terminal } from '../Simulator/Terminal';
import { VM_STR_DISPLAY } from '../constants/vending-machine-strings';

export class DisplaySimulatorAdapter implements DisplayInterface{
    private previousOutputString: string;
    private terminal: Terminal;

    constructor(terminal: Terminal) {
        this.terminal = terminal;
        this.previousOutputString = '';
      }

    public output(str: string): void {
        if (str !== this.previousOutputString) {
            this.previousOutputString = str;
            this.terminal.output(`${VM_STR_DISPLAY} ${str}`);
        }
    } 
}    
