# MaratON
## Jesús Isaac Estrada Ramírez

### Descripción
- Este es el sexto entregable del proyecto, en esta parte se trabajó principalmente en añadir la compatibilidad a nuestro proyecto para que ahora tambien pueda ser ejecutado mediante un servicio de contenedores como lo es docker.
---
### Objetivo
- Implementar funcionalidad del proyecto con docker.
---
### Requerimientos minimos
- Windows 10
- Navegador basados o no en Chromium
- Visual Studio Code
- Node.js
- API de TMDB
- .NET 9.0 SDK
- .NET 9.0 Runtime
- SQL Server 2022 Developer
- SQL Server Management Studio
- Docker Desktop 28.1.1
---
### Dependencias
- **Angular** 19.2.7
- **Node.Js** 22.14.0
- **RxJS**    7.8.1
- **Karma**   6.4.4
- **Jasmine** 4.6.1
- **Microsoft.AspNetCore.Authentication.JwtBearer** 9.0.5
- **Microsoft.AspNetCore.OpenApi** 9.0.4
- **Microsoft.EntityFrameworkCore.SqlServer** 9.0.5
- **Swashbuckle.AspNetCore** 8.1.1
---
### Instrucciones Correr nativo + Configuración + Usabilidad
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/JjMisterio/hub_peliculas.git
   ```

2. Abrir el proyecto en Visual Studio Code:
   - Ir a `\hub_peliculas-main`
   - Seleccionar la carpeta del proyecto

3. Instalar las dependencias de Node:
   - Abrir VS Code
   - Abrir una terminal (bash)
   - instalar las dependencias para angular
   ```bash
   npm install
   ```

4. Importar dados para la base de datos:
   - Abrir SQL Server Management Studio 20
   - Ingresar el archivo ubicado en `\hub_peliculas-main\Database T-SQL\Create-maraton.sql`
   - Una vez tengas el script abierto ejecutarlo para generar la base de datos

5. Restaurar los paquetes de .NET:
   - Abrir VS Code
   - Abrir una terminal (bash)
   - Ir a `\hub_peliculas-main\APIMaraton`
   - Restaurar dependencias
   ```bash
   dotnet restore
   ```
   - Compilar la aplicación
   ```bash
   dotnet build
   ```

6. Crea tu key para la API de TMDB:
   - Crea una cuenta en el servicio [TMDB](https://developer.themoviedb.org/reference/intro/getting-started) y obten tu key de la API
   - EN el proyecto abrir: `src\environments\environment.txt`
   - Remplaza la terminación de `.txt` a `.ts`
   - Colocar tu key de TMDB y el url del API v3

7. Iniciar el servidor:
   - Abrir una terminal (bash)
   - Escribir el siguiete comando para inicializar la app
   ```bash
   ng serve
   ```

8. Configurar APIMaraton:
   - Abrir el archivo `\hub_peliculas-main\APIMaraton\Program.cs`
   - En la linea `52` cambiar el link, por el obtenido al levantar tu aplicación de angular.
   - Abrir el archivo `\hub_peliculas-main\APIMaraton\appsettings.json`
   - Cambiamos el nombre de la base de datos por la que nosotros tengamos definida en SQL Server Management Studio
   - Nos dirigimos a la linea `10` y ahi escribimos el nombre de nuestra base `Server=EL-NOMBRE-DE-TU-BASE-DE-DATOS;`
   - En caso de no tener la autentificación de Windows, puedes refactorizar esa parte por tus credenciales.
   - En la linea `14` cambiar el link, por el obtenido al levantar tu aplicación de angular, aqui tambien.
   - En la linea `18` de `"SecretKey": ""` vas a remplazar las llaves vacias `""` por una llave que quieras privada y de preferencia en base64.
   - Abrir una terminal (bash)
   - Asegúrate de estar en la carpeta `\hub_peliculas-main\APIMaraton\`
   - Inicializar la API
   ```bash
   dotnet run
   ```

9. Agregar key de API de Base de datos:
   - EN el proyecto abrir: `src\environments\environment.ts`
   - Remplazamos la ultima linea por la direccion web que nos genero nuestra API en el paso anterior, asegurandonos de dejar `/api` al final de esa dirección

10. Ingreso:
   - En la parte inferior de `¿No tienes cuenta? Regístrate aquí` ingresamos para registrarnos
   - En la pagina de crear cuenta llenamos con toda la informacion que nos pide y damos clic en `Registrarse`
   - Una vez en la pagina de `Inicia Sesión` llenamos con las credenciales que creamos y hacemos clic en `Entrar`

11. Usabilidad:
   - Tienes una barra superior para dirigirte a distintas categorias
   - Tienes distintos titulos para hacer clic a cada uno de ellos
   - Obtienes su informacion de cada uno y los botones de "Ver ahora", "Agregar a favoritos" aun no funcionan
   - Si estan dentro de un titulo, puedes pulsar cualquie boton superior para regresar al home
   - El boton de cerrar sesion te permite borrar la sesion y regresar al login

12. Extras:
   - Comando para realizar los tests
   ```bash
   ng test
   ```
   - Comando para generar el code coverage
   ```bash
   ng test --no-watch --code-coverage
   ```
   - EN el proyecto abrir el archivo que se acaba de generar: `coverage\hub_peliculas\index.html`
---
### Instrucciones Correr (Para Docker)
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/JjMisterio/hub_peliculas.git
   ```
2. Configurar el Entorno de Angular:
   - Crea o modifica el archivo `src/environments/environment.prod.ts`
   - El contendio es similar a la plantilla de `environment.txt` de la misma carpeta
3. Configurar la Contraseña de la Base de Datos:
   - Abre el archivo `docker-compose.yml` que se encuentra en la raíz del proyecto
   - Busca la sección del servicio `db` y crea una contraseña del usuario `sa` en la variable `SA_PASSWORD`
4. Construir y Levantar los Contenedores:
   - Abre una terminal en la raíz del proyecto.
   - Ejecuta el siguiente comando para construir las imágenes y levantar los contenedores:
   ```bash
   docker-compose up --build
   ```
5. Crear las Tablas de la Base de Datos:
   - Abre SQL Server Management Studio y conéctate al servidor con las siguientes credenciales:
      - Server name: `localhost,1433`
      - Authentication: `SQL Server Authentication`
      - Login: `sa`
      - Password: La contraseña que estableciste en el paso 3.
   - Una vez conectado, abre y ejecuta el script ubicado en `Database T-SQL/Create-maraton.sql` para crear todas las tablas necesarias
6. Acceder a la Aplicación:
   - Abre tu navegador y ve a la siguiente dirección:
   ```
   http://localhost:4200
   ```
7. Detener la Aplicación:
   - Para detener todos los contenedores, regresa a la terminal y presiona `Ctrl + C`
   - O abre una nueva terminal en la misma carpeta y ejecuta:
   ```bash
   docker-compose down
   ```
---
### Mockup
![alt text](/assets/mockup.png "Mockup inicial del proyecto desplegado en la ventana de login e index de nuestro hub de peliculas")
---
### Diagrama Entidad - Relación
![alt text](/assets/Diagrama-E-R-BD.jpg "Diagrama entidad – relación de la base de datos, mostrando sus tablas, relaciones, y como es que funcionan estas")
---
### Captura de pantalla
![alt text](/assets/sprint05-01.png "Login fallo: Iniciar sesión")
- Login funcional este es el apartado de inicio de sesión que cuenta con campo de correo y contraseña, y abajo tiene el botón de iniciar sesión para redirigirte al home, ahora cuenta con una alerta en la parte superior derecha que da feedback al usuario
![alt text](/assets/sprint05-02.png "Login funcional: Registrarse")
- Login funcional este es el apartado de registrarse el cual cuenta con los campos de nombre, correo, contraseña y confirmar contraseña, además abajo tiene un botón de registrarse que los lleva al apartado de inicio de sesión, si los campos son válidos saldrá una alerta superior derecha que nos dirá que si se pudo crear la cuenta
![alt text](/assets/sprint05-03.png "Home: Pagina principal móvil")
- Esta es la página principal del proyecto donde se aprecia como es que se ve visualmente la interfaz para dispositivos móviles 
![alt text](/assets/sprint05-04.png "Title: título abierto")
- Dentro de nuestra página principal podemos dar clic a las imágenes de los títulos y estos se abren, permitiendo mostrar los detalles del título, asi como 2 botones inferiores: "Agregar a favoritos", "Ocultar"; Estos almacenan nuestras preferencias además de que ahora la página es estéticamente más agradable a la vista
![alt text](/assets/sprint05-05.png "Title: título abierto móvil")
- Es el mismo diseño de la página anterior, pero ahora mostrar la vista que tiene para dispositivos móviles
---
### Documentación de la API - Swagger
![alt text](/assets/swagger.png "Documentación de API MaratON")
- La API que utilizamos se encuentra documentada correctamente
---
### Reporte Code Coverage
![alt text](/assets/code-coverage.png "Reporte del code coverage de MaratON")
- Los test se encuentran actualizado a este ultimo entregable
---
### Reporte Testing
![alt text](/assets/testing.png "Reporte testing de MaratON")
- Podemos apreciar los tests individuales realizados para cada archivo y como estos se realizaron satisfactoriamente
---
### ¿Cómo lo hice?
El proyecto se desarrolló siguiendo estas etapas:
1. Se crearon los archivos de Dockerfile y .dockerignore para crear los contenedores del back y front
2. Se ajusto la información sensible del programa para que pueda correr en docker
3. Se agrego el archivo de nginx.config para que corriera la app de angular
4. Se creo el archivo de docker-compose.yml para crear y ejecutar las imágenes de nuestro proyecto
5. Se probo de que todo funcionara y se afinaron detalles menores
---
### Mejoras futuras
- Agregar más funcionalidades al proyecto
- Agregar migraciones en la API
---
### Errores
- La app no se funciona por si sola con docker al menos de que cargres primero la base de datos de manera manual
---
### Retrospectiva
#### ¿Qué hice bien?
- Se logro correr los contenedores de la aplicacion en docker de manera satisfactoria
#### ¿Qué no salió bien?
- La aplicacion al levantarse directo con docker aun no esta lista para funcionar hasta que no se cargue la base de datos
#### ¿Qué puedo hacer diferente?
- Agregar las migraciones a la API para que no tengamos problemas al volver a levantar la API en docker