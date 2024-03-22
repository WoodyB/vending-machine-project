/* 
** Display Adapter for our simulator
*/
import { DisplayInterface } from '../interfaces'
import { Terminal } from '../Simulator/Terminal';

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
            this.terminal.output(`DISPLAY: ${str}`);
        }
    } 
}    
