# MaratON
## Jesús Isaac Estrada Ramírez

### Descripción
- Este es el primer diseño de la pagina web de un hub de peliculas y series que se encuentra dividido en distinas categorias, para su facil extraccion y recuperación del contendio, ademas cuenta con una pequeña descripcion de los titulos y un login de momento simulado.
---
### Requerimientos minimos
- Windows 10
- Navegador basados o no en Chromium
- Visual Studio Code
---
### Instrucciones
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/JjMisterio/hub_peliculas.git
   ```

2. Abrir el proyecto en Visual Studio Code:
   - Ir a `\hub_peliculas-main`
   - Seleccionar la carpeta del proyecto

3. Instalar la extensión Live Server:
   - Abrir VS Code
   - Ir a Extensiones (Ctrl+Shift+X)
   - Buscar "Live Server"
   - Instalar la extensión

4. Configurar el puerto (opcional):
   - Abrir `.vscode\settings.json`
   - Modificar el puerto si es necesario:
   ```json
   "liveServer.settings.port": 5501
   ```

5. Iniciar el servidor:
   - Click derecho en `login.html`
   - Seleccionar "Open with Live Server"
---
### Mockup
![alt text](/assets/proyect/mockup.png "Mockup inicial del proyecto desplegado en la ventana de login e index de nuestro hub de peliculas")
---
### Capturas de pantalla
![alt text](/assets/proyect/sprint01-01.png "Login simulado: Iniciar sesión")
- Login simulado este es el apartado de inicio de sesión que cuenta con campo de correo/usuario y contraseña, y abajo tiene el botón de iniciar sesión para redirigirte al índex
![alt text](/assets/proyect/sprint01-02.png "Login simulado: Registrarse")
- Login simulado este es el apartado de registrarse el cual cuenta con los campos de nombre, usuario, correo, contraseña y repetir contraseña, además abajo tiene un botón de registrarse que los lleva al apartado de inicio de sesión
![alt text](/assets/proyect/sprint01-03.png "Index: Pagina principal")
- Esta es la página principal del proyecto donde él se puede ver una barra superior con distintas opciones ademad de un botón para cerrar la sesión, más abajo se muestran los títulos divididos en categorías que corresponden a las superiores
![alt text](/assets/proyect/sprint01-04.png "Index: Pagina principal, título abierto")
- Dentro de nuestra página principal podemos dar clic a las imágenes de los títulos y estos se abren, permitiendo mostrar los detalles del título, asi como 4 botones inferiores: "ver", "me gusta", "ocultar", "cerrar"; El primero aun no hace nada, el segundo te agrega tu título a favoritos y se cambia de nombre a "ya no me gusta", el siguiente oculta el título, quitándolo de todas las categorías mandándolo al fondo y le cambia el nombre a "desocultar", y el ultimo cierra su información
![alt text](/assets/proyect/sprint01-05.png "Index: Pagina principal, redireccion")
- Este último apartado nos muestra que la barra superior esta fija al sitio en todo momento, para poder navegar con ella más fácilmente, además de que cada una de las opciones, tanto como la lista de las categorías como los tags, te redirigirán a los apartados de las películas que tengan esa categoría que se busca de manera automática
---
### ¿Cómo lo hice?
El proyecto se desarrolló siguiendo estas etapas:
1. Diseño del mockup inicial
2. Configuración del repositorio en GitHub
3. Desarrollo de las plantillas HTML (index y login)
4. Implementación de la lógica de autenticación
5. Creación del sistema de visualización de títulos
6. Integración con base de datos de prueba
7. Pulir el diseño y estilo de la pagina
---
### Errores
- El login es simulado, solo verifica que tenga un dato escrito para ingresar
- La base de datos no se modifica porque esta de manera local
- El boton de "ver" no hace nada ni redirecciona a ninguna parte
---
### Retrospectiva
#### ¿Qué hice bien?
- Se logro hacer una pagina web funcional prototipo cumpliendo el primer sprint
#### ¿Qué no salió bien?
- El diseño del sitio web no salio del todo de mi agrado
#### ¿Qué puedo hacer diferente?
- Dedicarle mas tiempo al diseño y a la planeacion para que todo fluya mas rapido