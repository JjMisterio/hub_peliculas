export interface User {
    idUser: number;
    userName: string;
    userEmail: string;
    dateCreated: Date;
    dateModified: Date;
}

export interface CreateUserDto {
    userName: string;
    userEmail: string;
    password: string;
}

export interface UpdateUserDto {
    userName?: string;
    userEmail?: string;
    password?: string;
}

export interface LoginDto {
    email: string;
    password: string;
} 