# MaratON
## Jesús Isaac Estrada Ramírez

### Descripción
- Este es el cuarto entregable del proyecto, en esta parte se trabajó principalmente en el diseño y creación de la base de datos, además de crear una API que nos servirá de puente entre la base de datos y nuestra aplicación además de una conexión inicial para ya validar el login y registro de usuarios, por ultimo se realizo el lazy loading a los componentes que lo necesitaran.
---
### Objetivo
- Implementar la base de datos de T-SQL en el proyecto de maraton.
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
   - En la linea `24` cambiar el link, por el obtenido al levantar tu aplicación de angular.
   - Abrir el archivo `\hub_peliculas-main\APIMaraton\appsettings.json`
   - Cambiamos el nombre de la base de datos por la que nosotros tengamos definida en SQL Server Management Studio
   - Nos dirigimos a la linea `10` y ahi escribimos el nombre de nuestra base `Server=EL-NOMBRE-DE-TU-BASE-DE-DATOS;`
   - En caso de no tener la autentificación de Windows, puedes refactorizar esa parte por tus credenciales.
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
![alt text](/assets/sprint04-01.png "Login funcional: Iniciar sesión")
- Login funcional este es el apartado de inicio de sesión que cuenta con campo de correo y contraseña, y abajo tiene el botón de iniciar sesión para redirigirte al home
![alt text](/assets/sprint04-02.png "Login funcional: Registrarse")
- Login funcional este es el apartado de registrarse el cual cuenta con los campos de nombre, correo, contraseña y confirmar contraseña, además abajo tiene un botón de registrarse que los lleva al apartado de inicio de sesión, si los campos son invalidos al igual que el login los marca de rojo
![alt text](/assets/sprint04-03.png "Home: Pagina principal")
- Esta es la página principal del proyecto donde él se puede ver una barra superior con distintas opciones ademad de un botón para cerrar la sesión, más abajo se muestran los títulos divididos en 4 categorías que corresponden a las superiores, que si les damos clic nos llevara a cada categoria y cada categoria cuenta con un despliegue mas comodo para el usuario
![alt text](/assets/sprint04-04.png "Home: Pagina principal fallo")
- En caso de que alguna de las imagenes de la API de TMDB falle o no se cargue correctamente mostraremos una imagen por defecto cargada directamente en nuestro servidor como medida preventiva
![alt text](/assets/sprint04-05.png "Title: título abierto")
- Dentro de nuestra página principal podemos dar clic a las imágenes de los títulos y estos se abren, permitiendo mostrar los detalles del título, asi como 4 botones inferiores: "Ver ahora", "Agregar a favoritos"; Aun no tienen funcion estos botones hasta conectarlos a una base de datos, ademas haciendo clic a los botones de arriba nos llevaran a home
---
### Reporte Code Coverage
![alt text](/assets/code-coverage.png "Reporte del code coverage de MaratON")
- Podemos apreciar que todos los tests superan el umbral del 50% (sprint 3 no actualizado)
---
### Reporte Testing
![alt text](/assets/testing.png "Reporte testing de MaratON")
- Podemos apreciar los tests individuales realizados para cada archivo y como estos se realizaron satisfactoriamente (sprint 3 no actualizado)
---
### ¿Cómo lo hice?
El proyecto se desarrolló siguiendo estas etapas:
1. Se comenzó por Arreglar el feedback obtenido el sprint 2 para que no hubiera tantas películas en home sueltas
2. Se implemento una nueva característica para cambiar las imágenes, en caso de que fallen
3. Se aplico lazy loading a los componentes que se consideró pertinentes
4. Se diseño la base de datos e implemento en el servidor
5. Se creo una API que funcionaria de intermediaria con toda la lógica lista para desplegarla en angular
6. Se implemento la API en angular para los apartados de login y register de la aplicación además de dejar el ambiente preparado para las transacciones internas de la app
---
### Errores
- El boton de "Ver ahora", "Agregar a favoritos" no tienen funcionamiento
- El testing no se actualizo para este spring
---
### Retrospectiva
#### ¿Qué hice bien?
- Se logro crear la base de datos, la api, y una conexión funcional para el login
#### ¿Qué no salió bien?
- No se realizó testing de las nuevas funciones, ni de las existentes que cambiaron de lógica
#### ¿Qué puedo hacer diferente?
- Ahora que lo más pesado está funcionando, puedo definir de manera correcta las funciones faltantes para ahora si darme tiempo de actualizar los test