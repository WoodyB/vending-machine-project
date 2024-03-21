/* 
** Display Adapter for our simulator
*/
import { DisplayInterface } from '../interfaces'

export class DisplaySimulatorAdapter implements DisplayInterface{
    private previousOutputString: string;

    constructor() {
        this.previousOutputString = '';
      }

    public output(str: string): void {
        if (str !== this.previousOutputString) {
            this.previousOutputString = str;
            console.log(str);
        }
    } 
}    
