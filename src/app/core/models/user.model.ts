export interface User {
    idUser: number;
    name: string;
    email: string;
    dateCreation: Date;
    dateModified: Date;
}

export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
}

export interface UpdateUserDto {
    name?: string;
    email?: string;
    password?: string;
}

export interface LoginDto {
    email: string;
    password: string;
} 