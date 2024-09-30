import { ProtocolDriverTypes } from './constants';
import { TestProtocolDriverInterface } from './interfaces';
import { SimulatedKeyboardDriver } from './test-protocol-drivers/SimulatedKeyboardProtocolDriver/SimulatedKeyboardProtocolDriver';
import { STDIODriver } from './test-protocol-drivers/STDIOProtocolDriver/STDIOProtocolDriver';
import { ManualProtocolDriver } from './test-protocol-drivers/ManualProtocolDriver/ManualProtocolDriver';

export function determineProtocolDriver(): TestProtocolDriverInterface {
    const protocolDriverType = getProtocolDriverType();
    return resolveDriverType(protocolDriverType);
}

function getProtocolDriverType(): ProtocolDriverTypes {
    setDefaultProtocolDriver(); 
    if (!isValidProtocolDriver()) {
        throw new Error(`Invalid PROTOCOL_DRIVER "${process.env.PROTOCOL_DRIVER}"`);
    }
    return ProtocolDriverTypes[process.env.PROTOCOL_DRIVER as keyof typeof ProtocolDriverTypes];
}

function resolveDriverType(type: ProtocolDriverTypes): TestProtocolDriverInterface {
    const driverMap = new Map<ProtocolDriverTypes, { new (): TestProtocolDriverInterface }>();

    driverMap.set(ProtocolDriverTypes.SIM_KEYBOARD, SimulatedKeyboardDriver);
    driverMap.set(ProtocolDriverTypes.STDIO, STDIODriver);
    driverMap.set(ProtocolDriverTypes.MANUAL, ManualProtocolDriver);

    const Driver = driverMap.get(type);
    if (Driver) {
        return new Driver();
    }

    throw new Error("resolveDriverType: Invalid protocolDriverType");
}

function setDefaultProtocolDriver(): void { 
    if (!process.env.PROTOCOL_DRIVER) {
        process.env.PROTOCOL_DRIVER = ProtocolDriverTypes.SIM_KEYBOARD; 
    } 
}

function isValidProtocolDriver(): boolean {
    return Object.values(ProtocolDriverTypes).includes(process.env.PROTOCOL_DRIVER as ProtocolDriverTypes); 
}