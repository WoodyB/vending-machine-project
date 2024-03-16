/* 
** System Adapter for unit testing
*/
import { SystemInterface } from '../interfaces'
import { systemEvents } from '../types';

export class SystemUnitTestAdapter implements SystemInterface{
    private systemEvent: systemEvents;

    constructor() {
        this.systemEvent = systemEvents.NO_EVENT;
      }
  
    public setSystemEvent(systemEvent: systemEvents): void {
        this.systemEvent = systemEvent;
    }
 
    public readSystemEvent(): systemEvents {
        return this.systemEvent ;
    }
    
}    
