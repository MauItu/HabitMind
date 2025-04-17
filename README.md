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
- **Gestión completa de hábitos**: CRUD y marcaje como completado.  
- **Seguimiento de progreso**: registro diario de tiempo invertido.  
- **Panel de estadísticas**: gráficos dinámicos con Chart.js.  
- **Contenido motivacional**: frases inspiradoras y “4 leyes del cambio”.  
- **Panel de administración** para gestionar usuarios y roles.  
- **Diseño responsivo** para escritorio y móviles.

---

## Estructura del proyecto

HabitMind/
├── src/
│   ├── controller/       # JavaScript controllers for initializing components and handling logic
│   ├── model/            # Backend logic and database interaction
│   │   ├── home/         # Modules for handling habits, charts, and animations
│   │   └── db.js         # Database connection setup
│   ├── view/             # Frontend components and HTML templates
│   │   ├── css/          # Stylesheets
│   │   ├── html/         # HTML files
│   │   └── js/           # JavaScript components for the frontend
├── README                # Project documentation
└── .env                  # Environment variables (not included in the repository)
```

yaml
Copiar
Editar

---

## Tecnologías

- **Node.js** como entorno de ejecución  
- **Express.js** para servidor y rutas  
- **PostgreSQL (Neon)** como base de datos  
- **Chart.js** para gráficos de progreso  
- **bcrypt.js** para seguridad de contraseñas  
- **jsonwebtoken** (JWT) para autenticación  
- **dotenv** para configuración de variables de entorno

---

## Instalación

1. Clona el repositorio y sitúate en `main`:
   ```bash
   git clone https://github.com/MauItu/HabitMind.git
   cd HabitMind
   git checkout main
Instala dependencias:

bash
Copiar
Editar
npm install
Configuración
Crea un archivo .env en la raíz con:

env
Copiar
Editar
DATABASE_URL=<tu_url_postgres_o_neon>
JWT_SECRET=<clave_secreta_para_JWT>
PORT=3000
Nunca subas el .env al repositorio.

Ejecución
Desarrollo (auto-reload):

bash
Copiar
Editar
npm run dev
Producción:

bash
Copiar
Editar
npm start
Accede en http://localhost:3000/.

API REST

Método	Ruta	Descripción
POST	/api/register	Registro de usuario
POST	/api/login	Autenticación y obtención de JWT
POST	/api/habits	Crear hábito (requiere JWT)
GET	/api/habits/:userId	Listar hábitos de un usuario
POST	/api/habit-tracking	Registrar tiempo de hábito
GET	/api/habit-tracking/:habitId	Ver historial de seguimiento
Contribuir
Haz fork del repositorio.

Crea una rama de tu feature o fix:

bash
Copiar
Editar
git checkout -b feature/nombre
Haz commits claros.

Abre un Pull Request describiendo tus cambios.

Licencia
Este proyecto está bajo la MIT License. Consulta LICENSE para más detalles.

Contacto
Autor: Mauricio Jesús Iturriza Medina

Email: mauiturriza@gmail.com
