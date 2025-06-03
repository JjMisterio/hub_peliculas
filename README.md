# MaratON
## Jesús Isaac Estrada Ramírez

### Descripción
- Este es el quinto entregable del proyecto, en esta parte se trabajó principalmente en el funcionamiento interno de la aplicación, con mejoras de la api, su documentación, algunos cambios estéticos y la conexión completa con nuestra aplicación de angular.
---
### Objetivo
- Implementar por completo la API en el proyecto.
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
### Instrucciones
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
1. Se comenzó por documentar la API, con la información que teníamos hasta el momento
2. Después se trabajó en las nuevas características visuales de este sprint
3. Se cambio partes del funcionamiento de la api, para utilizar tokens de jwt y se reacomodaron los cors
4. Se implemento lo que faltaba de la api para guardar las preferencias de los usuarios
5. Se reorganizo el login para que aceptara los tokens de inicio de sesión, además a agregar algunos mecanismos de seguridad extra en el front
6. Con una base sólida se implementaron nuevos test para la mayor parte del proyecto de angular
---
### Mejoras futuras
- Agregar más cosas útiles al proyecto para que se note un progreso entre cada entregable
- No dejar los test para último momento
- Poderle dedicar más tiempo a desarrollar los entregables del proyecto
---
### Errores
- El testing del proyecto no alcanza el 100% y quedaron algunos test sin funcionar
---
### Retrospectiva
#### ¿Qué hice bien?
- Se logro conectar el proyecto con la api, en las partes faltantes y todos los detalles implementados se cuidaron al máximo
#### ¿Qué no salió bien?
- Algunos test no los pude solucionar y quedaron como pendientes
#### ¿Qué puedo hacer diferente?
- Dedicarle más tiempo a todas las actividades que se realizan relacionadas con este proyecto para entregar un mejor resultado