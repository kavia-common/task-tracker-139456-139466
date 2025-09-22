# Ocean Professional Todo Frontend

A minimalist React frontend for a fullstack todo application. It implements authentication (register/login/logout) and full CRUD for todos, consuming the Django REST API.

## Features
- Session-based auth (username/password), with "me" session restore
- View, search, filter (Active/Completed), add, edit, toggle complete, and delete todos
- Ocean Professional classic UI theme (clean, minimalist, responsive)
- No heavy UI libraries; pure React + CSS

## Configuration
Set the backend API base URL via env:
- `REACT_APP_API_BASE_URL` (default `/api`)

Copy `.env.example` to `.env` and adjust as needed.

For local dev when backend runs on port 3001, this project uses CRA proxy:
```json
"proxy": "http://localhost:3001"
```
so `/api` requests are forwarded to the backend.

## Scripts
- `npm start` — start development server (http://localhost:3000)
- `npm test` — run tests
- `npm run build` — build for production

## Styling
The Ocean Professional theme is implemented in `src/components/ocean.css`. Main components:
- Buttons, Inputs, Selects, Cards
- Header with brand and auth actions
- Responsive grid layout with a two-column main area on desktop

## Code Structure
- `src/config.js` — API base URL resolution
- `src/api.js` — API client (AuthAPI, TodosAPI)
- `src/context/AuthContext.js` — Auth state provider
- `src/components/UI.js` — Reusable UI primitives
- `src/components/ocean.css` — Theme styles
- `src/components/AuthForms.js` — Login and Register forms
- `src/components/TodoList.js` — Main todo list with filters and CRUD
- `src/App.js` — App composition

## Notes
- This app assumes Django session authentication endpoints at `/auth/*` and todos CRUD at `/todos/*` per backend spec.
- CSRF header `X-CSRFToken` is sent for unsafe methods if a `csrftoken` cookie is present.

