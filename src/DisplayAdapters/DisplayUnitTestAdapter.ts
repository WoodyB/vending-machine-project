/* 
** Display Adapter for unit testing
*/
import { DisplayInterface } from '../interfaces'

export class DisplayUnitTestAdapter implements DisplayInterface{
    private stringsDisplayed: string[];
    private previousOutputString: string;
  
    constructor() {
      this.stringsDisplayed = [];
      this.previousOutputString = '';
    }

    public output(str: string): void {
        if (str !== this.previousOutputString) {
            this.previousOutputString = str;
            this.stringsDisplayed.push(str);
        }
    }
    
    public getStringsDisplayed(): string[] {
        return this.stringsDisplayed;
    }
}    
