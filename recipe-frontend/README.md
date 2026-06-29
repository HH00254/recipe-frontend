# Recipe App Frontend

A modern React frontend application for managing recipes.  
This project connects to a Django REST Framework backend API and allows users to create, view, edit, and manage their personal recipe collection.

## Features

- User authentication
- Login and registration screens
- View personal recipe collection
- Create new recipes
- Update existing recipes
- Delete recipes
- Upload recipe images
- Manage recipe ingredients
- Manage recipe tags
- Search and filter recipes
- Responsive user interface

## Tech Stack

- React
- JavaScript
- Vite
- React Router
- Axios
- CSS / Tailwind CSS
- REST API Integration

## Backend Integration

This frontend communicates with a Django REST API backend.

Backend Repository:

```text
https://github.com/HH00254/recipe-app-api
```

API features include:

- Token authentication
- Recipe CRUD operations
- Image uploads
- Ingredient management
- Tag management
- User account management

## Running Locally

Clone the repository:

```bash
git clone https://github.com/HH00254/recipe-frontend.git
```

Navigate into the project:

```bash
cd recipe-frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Application will run at:

```text
http://localhost:5173/
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000/api
```

This points the React application to the Django backend.

## Project Structure

```text
src/
├── api/
│   └── API communication
│
├── components/
│   └── Reusable UI components
│
├── pages/
│   └── Application screens
│
├── hooks/
│   └── Custom React hooks
│
├── App.jsx
└── main.jsx
```

## Skills Demonstrated

This project demonstrates:

- React component architecture
- State management
- API integration
- Authentication handling
- Form management
- Frontend routing
- Full-stack development workflow
- Connecting React with Django REST APIs

## Related Project

This application works together with:

**Recipe App API**  
Django REST Framework backend providing authentication, database models, and API endpoints.

## Author

Developed by Hans Hochbaum