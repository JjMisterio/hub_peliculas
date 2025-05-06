# MaratON
## Jesús Isaac Estrada Ramírez

### Descripción
- Este es el tercer entregable del proyecto, en esta parte se trabajó principalmente en hacer varios testing del proyecto para probar las distintas funcionalidades de todo lo que se lleva construido hasta el momento, además de que se modificó HomeComponent para que ahora utilice RxJS y sea asíncrono.
---
### Objetivo
- Implementar funciones asíncronas y obtener un 50% de testing con Code Coverage.
---
### Requerimientos minimos
- Windows 10
- Navegador basados o no en Chromium
- Visual Studio Code
- Node.js
- API de TMDB
---
### Dependencias
- **Angular** 19.2.7
- **Node.Js** 22.14.0
- **RxJS**    7.8.1
- **Karma**   6.4.4
- **Jasmine** 4.6.1
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

4. Crea tu key para la API de TMDB:
   - Crea una cuenta en el servicio [TMDB](https://developer.themoviedb.org/reference/intro/getting-started) y obten tu key de la API
   - EN el proyecto abrir: `src\environments\environment.txt`
   - Remplaza la terminación de `.txt` a `.ts`
   - Colocar tu key de TMDB y el url del API v3

5. Iniciar el servidor:
   - Abrir una terminal (bash)
   - Escribir el siguiete comando para inicializar la app
   ```bash
   ng serve
   ```

6. Ingreso:
   - Ingresa las siguientes credenciales del login simulado para entrar a la app:
   - `admin@maraton.com`
   - `12345678`

7. Usabilidad:
   - Tienes una barra superior para dirigirte a distintas categorias
   - Tienes distintos titulos para hacer clic a cada uno de ellos
   - Obtienes su informacion de cada uno y los botones de "Ver ahora", "Agregar a favoritos" aun no funcionan
   - Si estan dentro de un titulo, puedes pulsar cualquie boton superior para regresar al home
   - El boton de cerrar sesion te permite borrar la sesion y regresar al login

8. Extras:
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
### Captura de pantalla
![alt text](/assets/sprint03-01.png "Login simulado: Iniciar sesión")
- Login simulado este es el apartado de inicio de sesión que cuenta con campo de correo/usuario y contraseña, y abajo tiene el botón de iniciar sesión para redirigirte al home
![alt text](/assets/sprint03-02.png "Login simulado: Registrarse")
- Login simulado este es el apartado de registrarse el cual cuenta con los campos de nombre, correo, contraseña, además abajo tiene un botón de registrarse que los lleva al apartado de inicio de sesión y si los campos son invalidos al igual que el login los marca de rojo
![alt text](/assets/sprint03-03.png "Home: Pagina principal")
- Esta es la página principal del proyecto donde él se puede ver una barra superior con distintas opciones ademad de un botón para cerrar la sesión, más abajo se muestran los títulos divididos en 4 categorías que corresponden a las superiores, que si les damos clic nos llevara a cada categoria
![alt text](/assets/sprint03-04.png "Title: título abierto")
- Dentro de nuestra página principal podemos dar clic a las imágenes de los títulos y estos se abren, permitiendo mostrar los detalles del título, asi como 4 botones inferiores: "Ver ahora", "Agregar a favoritos"; Aun no tienen funcion estos botones hasta conectarlos a una base de datos, ademas haciendo clic a los botones de arriba nos llevaran a home
![alt text](/assets/sprint03-05.png "Title: título abierto, smarthpone")
- Este último apartado nos muestra que se diseño la primera version de las paginas que tambien se encuentran adaptadas a dispositivos moviles y sigue funcionando con normalidad
---
### Reporte Code Coverage
![alt text](/assets/code-coverage.png "Reporte del code coverage de MaratON")
- Podemos apreciar que todos los tests superan el umbral del 50%
---
### Reporte Testing
![alt text](/assets/testing.png "Reporte testing de MaratON")
- Podemos apreciar los tests individuales realizados para cada archivo y como estos se realizaron satisfactoriamente
---
### ¿Cómo lo hice?
El proyecto se desarrolló siguiendo estas etapas:
1. Se comenzo por correr el test del proyecto
2. Uno a uno se arreglaron los errores base de los tests
3. Se analizo cada archivo para agregar tantos tests como sean nesesarios
4. Se verifico el avance de cada test mediante el code coverage
5. se modifico la logica del HomeComponent para volverlo asincrono con rxjs
6. Se rediseño el test para ese codigo encaje con la nueva version del HomeComponent
---
### Errores
- El login es simulado, solo verifica las credenciales placeholder
- Aun no pueden guardar nuevos usuarios para ingresar al sistema
- El boton de "Ver ahora", "Agregar a favoritos" no tienen funcionamiento
- El testing no esta al 100%
---
### Retrospectiva
#### ¿Qué hice bien?
- Se logro hacer la mayor parte del testing de todo el proyecto
#### ¿Qué no salió bien?
- Le dedique demasiado tiempo al testing que si realizo un cambio puuede que ese testing ya no funcione en el fututo como me paso con el HomeComponent
#### ¿Qué puedo hacer diferente?
- Unicamente dedicarle tiempo al testing en funciones que probablemente no cambien en el futuro o que ya sepa que son fijas y no van a cambiar