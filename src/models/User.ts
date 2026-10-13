import type { PublicUser } from '../types/UserTypes.js';

export class User {
    constructor(
        public readonly id: number,
        public username: string,
        public email: string
    ) {}

    toPublic(): PublicUser {
        return {
            id: this.id,
            username: this.username,
            email: this.email
        };
    }
}