export class NotConnectedDeviceError extends Error {
    constructor() {
        super('Dispositivo não conectado');
    }
}