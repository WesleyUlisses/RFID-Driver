import * as usb from 'usb';

export class RfidDriverMock {

    private device: usb.Device = new usb.Device();

    constructor(vendorId: number, productId: number) {

        console.log(`Mocked RFID driver initialized for vendor ID ${vendorId} and product ID ${productId}`);
        
    }

    public isDeviceConnected(): boolean {
        return true;
    }

    public readData(command: string): string {
        return '00000000';
    }

    public writeData(command: string): string {
        return '00000000';
    }

    public printDeviceCapabilities(): void {
        console.log('Mocked device capabilities');
    }

    public close(): void {
        console.log('Mocked device closed');
    }

}