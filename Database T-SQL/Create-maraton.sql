-- Comprobar si la base de datos ya existe antes de crearla
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'maraton2')
BEGIN
    CREATE DATABASE maraton;
    PRINT 'Base de datos "maraton" creada exitosamente.';
END
ELSE
BEGIN
    PRINT 'La base de datos "maraton" ya existe.';
	ALTER DATABASE maraton SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE maraton;
    PRINT 'Base de datos "maraton" eliminada.';
	CREATE DATABASE maraton;
    PRINT 'Base de datos "maraton" creada exitosamente.';
END
GO

-- Usar la base de datos
USE maraton;
GO

-- Manejo de errores
BEGIN TRY

    IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL
    BEGIN
        TRUNCATE TABLE dbo.Users;
        DROP TABLE dbo.Users;
        PRINT 'Tabla "Users" eliminada.';
    END

    -- Crear tabla Users
    CREATE TABLE Users (
        id_user INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(200) NOT NULL,
        email NVARCHAR(255) NOT NULL,
        password_hash BINARY(64) NOT NULL,
        date_creation DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

        CONSTRAINT UQ_Users_Email UNIQUE (email)
    );
    PRINT 'Tabla "Users" creada exitosamente.';

    -- Crear tabla UserMoviePreferences
    CREATE TABLE UserMoviePreferences (
        id_user_preference INT IDENTITY(1,1) PRIMARY KEY,
        id_user INT NOT NULL,
        id_movie_tmdb INT NOT NULL,
        is_favorite BIT NOT NULL DEFAULT 0,
        is_hidden BIT NOT NULL DEFAULT 0,
        date_modified DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

        CONSTRAINT FK_UserMoviePreferences_Users FOREIGN KEY (id_user) REFERENCES Users(id_user) ON DELETE CASCADE,
        CONSTRAINT UQ_User_Movie_Preference UNIQUE (id_user, id_movie_tmdb)
    );
    PRINT 'Tabla "UserMoviePreferences" creada exitosamente.';

    -- Crear índices
    CREATE INDEX IX_UserMoviePreferences_UserId ON UserMoviePreferences(id_user);
    CREATE INDEX IX_UserMoviePreferences_MovieIdTmdb ON UserMoviePreferences(id_movie_tmdb);
    PRINT 'Índices creados exitosamente.';

END TRY
BEGIN CATCH
    PRINT 'Ocurrió un error en la configuración de la base de datos.';
    PRINT ERROR_MESSAGE();
END CATCH;