import {
    StoredUser,
    UpdateUserDTO,
    PublicUser
} from "../types/UserTypes.js";

export interface IUserRepository {

    findAll(): Promise<PublicUser[]>;
    findById(id: number): Promise<PublicUser | null>;
    findByUsername(username: string): Promise<StoredUser | null>;
    create(data: {
        username: string;
        email: string;
        passwordHash: string;
    }): Promise<PublicUser>;
    update(id: number, data: UpdateUserDTO & { passwordHash?: string }): Promise<PublicUser>;
    delete(id: number): Promise<boolean>;

}