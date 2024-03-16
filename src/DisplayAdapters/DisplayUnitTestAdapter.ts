/* 
** Display Adapter for unit testing
*/
import { DisplayInterface } from '../interfaces'

export class DisplayUnitTestAdapter implements DisplayInterface{
    private stringsDisplayed: string[] = [];
  
    constructor() {
      this.stringsDisplayed = [];
    }

    public output(str: string): void {
        this.stringsDisplayed.push(str);
    }
    
    public getStringsDisplayed(): string[] {
        return this.stringsDisplayed;
    }
}    
