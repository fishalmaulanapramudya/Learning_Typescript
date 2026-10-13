export interface CreateUserDTO {
    username: string;
    email: string;
    password: string;
}

export interface UpdateUserDTO {
    username?: string;
    email?: string;
    password?: string;
}

export interface StoredUser {
    id: number;
    username: string;
    email: string;
    passwordHash: string;
}

export interface PublicUser {
    id: number;
    username: string;
    email: string;
}

export interface LoginUserDTO {
    username: string;
    password: string;
}