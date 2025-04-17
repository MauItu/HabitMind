# HabitMind

HabitMind es una aplicación web para la gestión de hábitos personales. Permite a los usuarios:

- **Registrar y autenticar** cuentas de forma segura.  
- **Crear, editar y eliminar** hábitos con atributos personalizables (color, frecuencia).  
- **Registrar tiempo invertido** en cada hábito diariamente.  
- **Visualizar estadísticas** semanales o totales mediante gráficos interactivos.  
- **Mantener la motivación** con citas diarias y una sección educativa sobre hábitos.  

---

## Tabla de contenidos

1. [Características](#características)  
2. [Estructura del proyecto](#estructura-del-proyecto)  
3. [Tecnologías](#tecnologías)  
4. [Instalación](#instalación)  
5. [Configuración](#configuración)  
6. [Ejecución](#ejecución)  
7. [API REST](#api-rest)  
8. [Contribuir](#contribuir)  
9. [Licencia](#licencia)  
10. [Contacto](#contacto)  

---

## Características

- **Autenticación segura** con contraseñas encriptadas y JWT.  
- **Gestión completa de hábitos**: creación, edición, eliminación y marcaje como completado.  
- **Seguimiento de progreso**: registro diario de tiempo invertido.  
- **Panel de estadísticas**: gráficos dinámicos con Chart.js.  
- **Contenido motivacional**: frases inspiradoras y “4 leyes del cambio”.  
- **Panel de administración** para gestionar usuarios y roles.  
- **Diseño responsivo** para escritorio y móviles.

---

## Estructura del proyecto

```bash
HabitMind/
├── src/            # Código fuente (controllers, models, routes, views)
├── public/         # Recursos estáticos (CSS, JS, imágenes)
├── docs/           # Documentación (requerimientos, casos de uso, refactor)
├── server.js       # Punto de entrada del servidor
├── package.json    # Dependencias y scripts
├── .env            # Variables de entorno (no versionado)
└── README.md       # Documentación del proyecto
```

---

## Tecnologías

- **Node.js** como entorno de ejecución  
- **Express.js** para servidor y rutas REST  
- **PostgreSQL (Neon)** como base de datos relacional  
- **Chart.js** para visualización de datos  
- **bcrypt.js** para encriptación de contraseñas  
- **jsonwebtoken** (JWT) para autenticación  
- **dotenv** para configuración de variables de entorno

---

## Instalación

1. Clona el repositorio y cambia a `main`:
   ```bash
   git clone https://github.com/MauItu/HabitMind.git
   cd HabitMind
   git checkout main
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```

---

## Configuración

Crea un archivo `.env` en la raíz con:

```env
DATABASE_URL=<tu_url_postgres_o_neon>
JWT_SECRET=<clave_secreta_para_JWT>
PORT=3000
```

---

## Ejecución

- **Desarrollo** (auto-reload):
  ```bash
  npm run dev
  ```
- **Producción**:
  ```bash
  npm start
  ```
Abre tu navegador en `http://localhost:3000/`.

---

## API REST

| Método | Ruta                           | Descripción                          |
| ------ | ------------------------------ | ------------------------------------ |
| POST   | `/api/register`                | Registro de usuario                  |
| POST   | `/api/login`                   | Autenticación y emisión de JWT       |
| POST   | `/api/habits`                  | Crear hábito (requiere JWT)          |
| GET    | `/api/habits/:userId`          | Listar hábitos de un usuario         |
| POST   | `/api/habit-tracking`          | Registrar tiempo de hábito           |
| GET    | `/api/habit-tracking/:habitId` | Ver historial de seguimiento         |

---

## Contribuir

1. Haz fork del repositorio.  
2. Crea una rama para tu feature o fix:
   ```bash
   git checkout -b feature/nombre
   ```
3. Haz commits claros y descriptivos.  
4. Abre un Pull Request describiendo tus cambios.

---

## Licencia

Este proyecto está bajo la **MIT License**. Consulta `LICENSE` para más detalles.

---

## Contacto

**Autores:**  
- Mauricio Jesús Iturriza Medina — mauiturriza@gmail.com
- Angel Andres Cortes Arboleda — angel.cortes0225@gmail.com
- Juan Andres Gomez Gonzalez — juan.andres.gomez.gonzalez22@gmail.com

