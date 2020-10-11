export class UserNotFoundError extends Error {
    id: number

    constructor(id: number, message: string) {
        super();

        this.id = id;
        this.message = message;
    }
}
