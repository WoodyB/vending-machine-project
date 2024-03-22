/* 
** System Adapter for unit testing
*/
import { SystemInterface } from '../interfaces'
import { SystemEvents } from '../types';

export class SystemUnitTestAdapter implements SystemInterface{
    private systemEvent: SystemEvents;

    constructor() {
        this.systemEvent = SystemEvents.NO_EVENT;
      }
  
    public setSystemEvent(systemEvent: SystemEvents): void {
        this.systemEvent = systemEvent;
    }
 
    public readSystemEvent():SystemEvents {
        return this.systemEvent 
    }

    public reportSystemEvent(systemEvent: SystemEvents): void {
        this.systemEvent = systemEvent;
    }
}    
