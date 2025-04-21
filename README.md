# MaratON
## Jesús Isaac Estrada Ramírez

### Descripción
- Este es el segundo diseño se migro la pagina web del un hub de peliculas, se conecto con la API de TMDB, para tener acceso a informacion de los titulos y ademas se mejoro el diseño general del sitio y se empezo a trabajar el diseño adaptado para dispositivos móviles.
---
### Requerimientos minimos
- Windows 10
- Navegador basados o no en Chromium
- Visual Studio Code
- Node.js
- API de TMDB
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

6. Extra:
   - Ingresa las siguientes credenciales del login simulado para entrar a la app:
   - `admin@maraton.com`
   - `12345678`
---
### Mockup
![alt text](/assets/mockup.png "Mockup inicial del proyecto desplegado en la ventana de login e index de nuestro hub de peliculas")
---
### Capturas de pantalla
![alt text](/assets/sprint02-01.png "Login simulado: Iniciar sesión")
- Login simulado este es el apartado de inicio de sesión que cuenta con campo de correo/usuario y contraseña, y abajo tiene el botón de iniciar sesión para redirigirte al home
![alt text](/assets/sprint02-02.png "Login simulado: Registrarse")
- Login simulado este es el apartado de registrarse el cual cuenta con los campos de nombre, correo, contraseña, además abajo tiene un botón de registrarse que los lleva al apartado de inicio de sesión y si los campos son invalidos al igual que el login los marca de rojo
![alt text](/assets/sprint02-03.png "Home: Pagina principal")
- Esta es la página principal del proyecto donde él se puede ver una barra superior con distintas opciones ademad de un botón para cerrar la sesión, más abajo se muestran los títulos divididos en 4 categorías que corresponden a las superiores, que si les damos clic nos llevara a cada categoria
![alt text](/assets/sprint02-04.png "Title: título abierto")
- Dentro de nuestra página principal podemos dar clic a las imágenes de los títulos y estos se abren, permitiendo mostrar los detalles del título, asi como 4 botones inferiores: "Ver ahora", "Agregar a favoritos"; Aun no tienen funcion estos botones hasta conectarlos a una base de datos, ademas haciendo clic a los botones de arriba nos llevaran a home
![alt text](/assets/sprint02-05.png "Title: título abierto, smarthpone")
- Este último apartado nos muestra que se diseño la primera version de las paginas que tambien se encuentran adaptadas a dispositivos moviles y sigue funcionando con normalidad
---
### ¿Cómo lo hice?
El proyecto se desarrolló siguiendo estas etapas:
1. Se creo un nuevo proyecto en Angular
2. Se remplazaron los todos los archivos para funcionar en el github
3. Se generaron los componentes, servicios, modelos y guards
4. Se conecto con la API de TMDB
5. Implementación de la lógica para tods estos componentes
6. Se rediseño la pagina para que tenga un mejor look visual
7. Pulir el diseño y estilo de la pagina
---
### Errores
- El login es simulado, solo verifica las credenciales placeholder
- Aun no pueden guardar nuevos usuarios para ingresar al sistema
- El boton de "Ver ahora", "Agregar a favoritos" no tienen funcionamiento
---
### Retrospectiva
#### ¿Qué hice bien?
- Se logro hacer migrar la pagina web funcional prototipo cumpliendo el segundo sprint
#### ¿Qué no salió bien?
- Costo mucho generar y entender el proyecto en angular, para que todo funcionara correctamente
#### ¿Qué puedo hacer diferente?
- Dedicarle mas tiempo al diseño y a aprender mas a utilizar angular