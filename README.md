
# Internet Folks

#  The "Internet Folks" project is an API for managing
 users, roles, and communities with features 
 like authentication, community creation, and
 role-based permissions. It uses JWT for 
 authentication and Snowflake IDs for secure
 user management.


 ## 🚀 Features

- User Authentication (Sign Up / Sign In)
- JWT-based Secure Sessions
- Role Management (Admin, Moderator, etc.)
- Community Management
- Member Moderation (Add / Remove / List)
- Snowflake ID Generator for distributed unique IDs
- RESTful API design

## 🏗️ Tech Stack

- **Backend:** Node.js, Express
- **Database:** sequelize
- **Authentication:** JWT
- **ID Generation:** Custom Snowflake ID Generator
- **Validation:** express-validator
- **Security:** dotenv, bcrypt 


## 📦 Installation

```bash
git clone https://github.com/mayuripy/Internet_floks.git
cd Internet_floks
npm install


## Create a .env.local file in the root:

 # Server configuration
NODE_PORT=5000
NODE_COOKIE_SECRET=your_cookie_secret_here
NODE_JWT_SECRET=your_jwt_secret_here

# PostgreSQL configuration
NODE_PORT="8000"
NODE_COOKIE_SECRET="your_choice"
NODE_JWT_SECRET="your_choice"
NODE_POSTGRES_DB="your_choice"
NODE_POSTGRES_USER="your_choice"
NODE_POSTGRES_PASSWORD="your_choice"
NODE_POSTGRES_HOST="your_choice"
NODE_POSTGRES_PORT=5432
NODE_POSTGRES_SSL=your_choice
NODE_POSTGRES_CLIENT_MIN_MESSAGES="your_choice"


##  Running the App
 
 # Start in development mode
npm run dev

# Start in production mode
npm start


 ## Folder Structure

Internet_folks/
│
├── controllers/              # Request handlers for each route
│   ├── auth.controller.js    # Signup, login logic
│   ├── role.controller.js    # Create/list roles
│   ├── community.controller.js # Create/list communities
│   └── member.controller.js  # Add/remove/list members
│
├── models/                   # Mongoose or Sequelize schemas/models
│   ├── user.model.js         # User schema/model
│   ├── role.model.js         # Role schema/model
│   ├── community.model.js    # Community schema/model
│   └── member.model.js       # Membership model
│
├── routes/                   # API endpoint definitions
│   ├── auth.routes.js
│   ├── role.routes.js
│   ├── community.routes.js
│   └── member.routes.js
│
├── middleware/               # Middleware functions
│   ├── auth.middleware.js    # JWT verification
│   ├── role.middleware.js    # RBAC authorization
│   └── error.middleware.js   # Centralized error handling
│
├── utils/                    # Utility/helper functions
│   ├── snowflake.js          # Snowflake ID generator logic
│   ├── hash.js               # Password hashing utilities
│   └── token.js              # JWT token creation/verification
│
├── config/                   # App configuration
│   ├── db.js                 # MongoDB or PostgreSQL connection
│   └── env.js                # Load and validate environment variables
│
├── .env.local                # Environment variables (not committed)
├── .gitignore                # Ignore node_modules, .env.local etc.
├── package.json              # Project metadata & dependencies
├── README.md                 # Documentation
└── server.js                 # Entry point — sets up Express app




