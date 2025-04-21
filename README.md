# MaratON
## Jesús Isaac Estrada Ramírez

### Descripción
- Este es el segundo diseño se migro la pagina web del un hub de peliculas, se conecto con la API de TMDB, para tener acceso a informacion de los titulos y ademas se mejoro el diseño general del sitio y se empezo a trabajar el diseño adaptado para dispositivos móviles.
---
### Objetivo
- Migrar de html, css, javascript nativo a **Angular**
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
---
### Captura de pantalla
![alt text](/assets/sprint02-01.png "Home: Pagina principal")
- Esta es la página principal del proyecto donde él se puede ver una barra superior con distintas opciones ademad de un botón para cerrar la sesión, más abajo se muestran los títulos divididos en 4 categorías que corresponden a las superiores, que si les damos clic nos llevara a cada categoria.
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