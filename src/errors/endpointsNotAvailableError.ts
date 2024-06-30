export class EndpointsNotAvailableError extends Error {
    constructor() {
        super('Endpoints não disponíveis');
    }
}