# 🍔 DDFood — Full-Stack Foodie Social Network & Restaurant Discovery Platform

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.18-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/query/latest)

> **Connect with fellow food lovers, share culinary adventures, review favorite dishes, and discover top-rated local restaurants in real-time.**

---

## 🔗 Live Demo & Preview

- **Live Demo**: [Live Demo Link](#) *(Frontend currently deployed at `https://dd-frontend-pv15.vercel.app`)*
- **Project Preview**:

![Project Demo](./assets/demo-placeholder.png)

---

## 📖 Overview

**DDFood** is a comprehensive, modern full-stack web application that merges the community-driven engagement of social networking with powerful restaurant and food discovery tools. Built for food enthusiasts, culinary creators, and everyday diners, DDFood provides an interactive space where users can document their gastronomic journeys, share vibrant food photos, write detailed reviews, and interact with a vibrant community of peers.

Whether you are looking to explore trending local eateries, inspect detailed dish ratings, bookmark inspirational food posts, or chat directly with fellow foodies, DDFood delivers a seamless, responsive, and aesthetically premium experience powered by cutting-edge technologies like **React 19**, **Vite**, **Tailwind CSS**, **Framer Motion**, and a robust **Node.js/Express/MongoDB** backend API.

---

## ✨ Key Features

### 📸 Interactive Social Feed & Food Blogging
- **Create & Share**: Easily upload food experiences, recipes, and photos using cloud storage integration (**Cloudinary** & **Multer**).
- **Community Interaction**: Like, comment on, and save favorite food posts to your customized bookmarks (`/saved`).
- **Curated Explore Feed**: Discover trending culinary posts and new creators through a dedicated Explore dashboard (`/explore`).

### 👥 Social Graph & User Profiles
- **Customizable Profiles**: Personalize user bios, avatars, and review history (`/profile/:id`).
- **Follower / Following System**: Build a culinary network by following fellow foodies and tracking community updates in real-time.
- **Activity Tracking**: Seamlessly manage your own posts, saved recipes, and interactive history.

### 🏛️ Restaurant Discovery & Deep Reviews
- **Explore Restaurants**: Browse a rich catalog of local restaurants with detailed profiles, addresses, operating hours, and imagery (`/restaurants`).
- **Community Reviews & Ratings**: Read authentic customer feedback and submit detailed ratings and structured reviews for restaurants (`RestaurantReview`).

### 🍕 Food Catalog & Dish Breakdown
- **Dedicated Dish Exploration**: Dive into specific food items, menus, and culinary categories (`/foods`).
- **Item-Specific Feedback**: Review individual food items independently from restaurants to highlight standout dishes (`FoodReview`).

### 💬 Real-Time User Messaging
- **Direct Chat System**: Connect with friends and fellow food lovers through an integrated user-to-user messaging system powered by backend chat models and APIs (`/api/chat`).

### 🔍 Advanced Search & Discovery
- **Global Search**: Effortlessly search across posts, user profiles, restaurants, and food items from a single unified interface (`/search`).
- **Interactive Map Support**: Visual geolocation and mapping integration for locating dining spots (`Map.jsx`).

### 🛡️ Enterprise-Grade Security & Authentication
- **Secure Auth Flow**: JSON Web Token (JWT) authentication utilizing HTTP-only cookies and bearer tokens.
- **Data Protection**: Password hashing via `bcryptjs`, request validation with `validator`, and automated email workflows via `nodemailer`.
- **API Defense**: Integrated rate-limiting (`express-rate-limit`) and HTTP header hardening (`helmet` & `cors`).

### 👑 Administrative Control Portal
- **Admin Dashboard**: Dedicated management suite (`/admin`) allowing administrators to moderate community content, manage users, and oversee restaurant and food database entries.

---

## 🛠️ Tech Stack

### Frontend Architecture
| Technology | Version / Library | Purpose |
| :--- | :--- | :--- |
| **Core Framework** | React `19.1.1` + Vite `7.1.7` | Next-generation UI rendering and lightning-fast build tooling |
| **Styling & UI** | Tailwind CSS `3.4` + PostCSS | Utility-first, responsive design system and custom theming |
| **Animations** | Framer Motion `11.5` | Smooth page transitions, micro-interactions, and UI animations |
| **State & Caching**| TanStack React Query `v5` | Asynchronous server state management, caching, and auto-refetching |
| **Routing** | React Router DOM `v6` | Client-side routing, protected routes, and layout persistence |
| **HTTP Client** | Axios `1.7` | Promise-based HTTP requests with credential and header interceptors |
| **Icons** | React Icons `v5` | Comprehensive iconography across navigation and components |

### Backend API & Database
| Technology | Version / Library | Purpose |
| :--- | :--- | :--- |
| **Runtime & Server**| Node.js + Express `5.1.0` | High-performance RESTful API architecture |
| **Database & ODM** | MongoDB + Mongoose `8.19` | Document-based NoSQL database with robust schema validation |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) + `cookie-parser` | Secure stateless user authentication and session handling |
| **Security Suite** | `helmet`, `cors`, `express-rate-limit`, `bcryptjs` | Comprehensive vulnerability mitigation and password encryption |
| **Media Handling** | `cloudinary` + `multer` + `streamifier` | Direct cloud image uploading, optimization, and buffer streaming |
| **Email Services** | `nodemailer` | Automated transactional emails and verification workflows |
| **Dev Tooling** | `nodemon`, `morgan`, `eslint`, `prettier` | Live server reloading, HTTP request logging, and code formatting |

---

## 📂 Project Structure

```text
DDfood/
├── README.md                   # Project documentation (You are here!)
├── backend/                    # Node.js + Express + MongoDB API Server
│   ├── config/                 # Database connection (db.js) & configuration
│   ├── controllers/            # Route business logic (Auth, Users, Posts, Restaurants, etc.)
│   ├── middleware/             # Custom authentication, error handling, and file upload middlewares
│   ├── models/                 # Mongoose schemas (User, Post, Comment, Restaurant, Food, Chat, Reviews)
│   ├── routes/                 # Express API endpoint definitions (/api/auth, /api/posts, etc.)
│   ├── utils/                  # Helper utilities and token generators
│   ├── server.js               # Main backend server application entry point
│   └── package.json            # Backend dependencies and npm scripts
│
└── frontend/
    └── DDfood/                 # React 19 + Vite Single Page Application
        ├── public/             # Static public assets and favicons
        ├── src/
        │   ├── assets/         # Images, illustrations, and local media
        │   ├── components/     # Reusable UI components
        │   │   ├── Bars/       # Navigation bars, sidebar, and footer
        │   │   ├── Cards/      # Post cards, food cards, and restaurant preview cards
        │   │   ├── Common/     # Protected route wrappers and UI primitives
        │   │   └── forms/      # Input forms for login, registration, and creation
        │   ├── context/        # React Context providers (AuthContext.jsx)
        │   ├── lib/            # Utility functions and API client configurations
        │   ├── pages/          # Full page views (Home, Explore, Restaurants, Foods, Profile, Admin, etc.)
        │   ├── App.jsx         # Root component with routing hierarchy and QueryClient setup
        │   ├── main.jsx        # DOM rendering entry point
        │   └── index.css       # Tailwind CSS directives and global design styles
        ├── tailwind.config.js  # Tailwind design system configuration
        ├── vite.config.js      # Vite bundler settings
        └── package.json        # Frontend dependencies and scripts
```

---

## 🚀 Getting Started

Follow these instructions to set up, install, and run the DDFood full-stack application locally on your machine.

### 📋 Prerequisites
Ensure you have the following installed on your local system:
- **Node.js** (v18.x or higher recommended)
- **npm** (v9.x or higher)
- **MongoDB** (Local instance running on port `27017` or a MongoDB Atlas connection string)
- **Cloudinary Account** (For image upload API credentials)

---

### 1️⃣ Backend Setup & Installation

1. Open your terminal and navigate to the backend directory:
   ```bash
   cd "D:\drive D\My All Coding\react\DDfood\backend"
   ```

2. Install the required backend dependencies:
   ```bash
   npm install
   ```

3. Create a configuration file named `config.env` inside the `backend/` directory and configure the following environment variables:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/ddfood
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=30d
   COOKIE_EXPIRE=30
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend API server will start running on `http://localhost:5000`.*

---

### 2️⃣ Frontend Setup & Installation

1. In a new terminal window, navigate to the frontend SPA directory:
   ```bash
   cd "D:\drive D\My All Coding\react\DDfood\frontend\DDfood"
   ```

2. Install the required frontend dependencies:
   ```bash
   npm install
   ```

3. *(Optional)* Create a `.env` file in `frontend/DDfood/` if you need to override default API endpoint targets:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend application will start running on `http://localhost:5173` (or the network URL specified by Vite).*

---

## 🧪 Available Scripts

### Backend (`/backend`)
- `npm run dev`: Launches the server in development mode using `nodemon` with hot-reloading.
- `npm start`: Starts the production server using Node.js directly (`node server.js`).

### Frontend (`/frontend/DDfood`)
- `npm run dev`: Starts the Vite local development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles and bundles the application for production deployment into the `dist/` directory.
- `npm run lint`: Runs ESLint across the codebase to identify code style and syntax issues.
- `npm run preview`: Locally previews the production build generated by `npm run build`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**. See the backend package details or contact the repository author for more information.

---

<p align="center">
  Built with ❤️ for Foodies around the world by <b>Abdullah</b>.
</p>
