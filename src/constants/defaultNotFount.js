export class DefaultNotFount {
    constructor(status, error, message, path) {
        this.timestamp = new Date().toISOString();
        this.status = status || 404;
        this.error = error || 'Not Found';
        this.message = message;
        this.path = path;
    }
}
