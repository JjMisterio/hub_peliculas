export interface UserMoviePreference {
    idUserPreference: number;
    idUser: number;
    idMovieTmdb: number;
    isFavorite: boolean;
    isHidden: boolean;
    dateModified: Date;
    userName: string;
    userEmail: string;
}

export interface CreateUserMoviePreferenceDto {
    idUser: number;
    idMovieTmdb: number;
    isFavorite: boolean;
    isHidden: boolean;
}

export interface UpdateUserMoviePreferenceDto {
    idUser: number;
    idMovieTmdb: number;
    isFavorite: boolean;
    isHidden: boolean;
}
