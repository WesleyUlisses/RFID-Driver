import { usb, InEndpoint, OutEndpoint } from "usb";
import { Buffer } from "buffer";
import { NotConnectedDeviceError } from "./errors/notConnectedDeviceError";
import { InterfacesNotAvailableError } from "./errors/InterfacesNotAvailableError";
import { EndpointsNotAvailableError } from "./errors/endpointsNotAvailableError";

export class RfidDriver {
    
    private device: usb.Device;

    constructor(vendorId: number, productId: number) {
        this.device = this.findDevice(vendorId, productId);
        this.openDevice();
    }

    public async readData(command: string): Promise<string> {
        const data = Buffer.from(command, 'hex');
        const response = await this.sendCommand(data);
        return response.toString('hex');
    }

    public async writeData(command: string): Promise<string> {
        const data = Buffer.from(command, 'hex');
        const response = await this.sendCommand(data);
        return response.toString('hex');
    }

    public printDeviceCapabilities(): void {
        
        this.validateDevice();

        if (!this.device.interfaces || this.device.interfaces.length === 0) {
            throw new InterfacesNotAvailableError();
        }

        this.device.interfaces.forEach((intf, index) => {
            console.log(`Interface ${index}:`);
            console.log(`  Interface Number: ${intf.interfaceNumber}`);
            console.log(`  Endpoints:`);

            intf.endpoints.forEach((endpoint) => {
                console.log(`    Endpoint Address: ${endpoint.address}`);
                console.log(`    Direction: ${endpoint.direction}`);
                console.log(`    Transfer Type: ${endpoint.transferType}`);
            });
        });
    }

    public close(): void {
        this.device.close();
    }

    private findDevice(vendorId: number, productId: number): usb.Device {
        const device = usb.getDeviceList().find(
            device =>
                device.deviceDescriptor.idVendor === vendorId &&
                device.deviceDescriptor.idProduct === productId
        ) as usb.Device;

        if (!device) {
            throw new NotConnectedDeviceError();
        }

        return device;
    }

    private openDevice(): void {
        if (!this.device) {
            throw new NotConnectedDeviceError();
        }

        this.device.open();
    }

    private async sendCommand(command: Buffer): Promise<Buffer> {
        this.validateDevice();

        const { outEndpoint, inEndpoint } = this.getEndpoints();

        return new Promise((resolve, reject) => {
            outEndpoint.transfer(command, error => {
                if (error) {
                    return reject(error);
                }

                inEndpoint.transfer(64, (error, data) => {
                    if (error) {
                        return reject(error);
                    }

                    resolve(data as Buffer);
                });
            });
        });
    }

    private validateDevice(): void {
        if (!this.device || !this.isDeviceConnectedSync()) {
            throw new NotConnectedDeviceError();
        }

        if (!this.device.interfaces || this.device.interfaces.length === 0) {
            throw new InterfacesNotAvailableError();
        }
    }

    private isDeviceConnectedSync(): boolean {
        if (!this.device) {
            return false;
        }

        try {
            const response = this.readDataSync('FFCA000000');
            return response !== '00000000';
        } catch {
            return false;
        }
    }

    private readDataSync(command: string): string {
        const data = Buffer.from(command, 'hex');
        const response = this.sendCommandSync(data);
        return response.toString('hex');
    }

    private sendCommandSync(command: Buffer): Buffer {
        this.validateDevice();

        const { outEndpoint, inEndpoint } = this.getEndpoints();

        const promise = new Promise<Buffer>((resolve, reject) => {
            outEndpoint.transfer(command, error => {
                if (error) {
                    return reject(error);
                }

                inEndpoint.transfer(64, (error, data) => {
                    if (error) {
                        return reject(error);
                    }

                    resolve(data as Buffer);
                });
            });
        });

        throw new Error("sendCommandSync should be re-implemented to handle Promise in synchronous context");
    }

    private getEndpoints(): { outEndpoint: OutEndpoint, inEndpoint: InEndpoint } {

        if (!this.device.interfaces || this.device.interfaces.length === 0) {
            throw new InterfacesNotAvailableError();   
        }

        const outEndpoint = this.device.interfaces[0].endpoints.find(
            endpoint => endpoint.direction === 'out'
        ) as OutEndpoint;

        const inEndpoint = this.device.interfaces[0].endpoints.find(
            endpoint => endpoint.direction === 'in'
        ) as InEndpoint;

        if (!outEndpoint || !inEndpoint) {
            throw new EndpointsNotAvailableError();
        }

        return { outEndpoint, inEndpoint };
    }
}
