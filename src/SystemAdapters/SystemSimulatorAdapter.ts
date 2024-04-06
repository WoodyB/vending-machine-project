import { SystemInterface } from '../interfaces'
import { SystemEvents } from '../types';

export class SystemSimulatorAdapter implements SystemInterface{
    private lastEvent: SystemEvents;

    constructor() {
        this.lastEvent = SystemEvents.NO_EVENT; 
      }

    public readSystemEvent(): SystemEvents {
        return this.lastEvent;
    }

    public reportSystemEvent(event: SystemEvents): void {
        this.lastEvent = event;
    }
    
}    
