Commands assume **Node.js ≥18**, **npm**, **Windows 11**, **VS Code**, executed from project root.

---

## 1. Backend Initialization (`/backend`)

```
cd backend
npm init -y
npm install express cors dotenv
npm install -D typescript ts-node-dev @types/node @types/express @types/cors
npx tsc --init
```

### Backend folder setup

```
mkdir src
mkdir src/routes src/controllers src/middlewares src/services src/utils
type nul > src/app.ts
type nul > src/server.ts
```

### Backend scripts (`backend/package.json`)

```
npm pkg set scripts.dev="ts-node-dev --respawn --transpile-only src/server.ts"
npm pkg set scripts.build="tsc"
npm pkg set scripts.start="node dist/server.js"
```

---

## 2. Frontend Initialization (`/frontend`)

```
cd ../frontend
npx create-next-app@latest . ^
  --ts ^
  --tailwind ^
  --eslint ^
  --app ^
  --src-dir ^
  --import-alias "@/*"
```

Install common frontend utilities:

```
npm install axios
```

---

## 3. Environment Files (already created by you)

Backend:

```
backend/.env.development
backend/.env.production
```

Frontend:

```
frontend/.env.local
```

No commands needed. Just fill values.

---

## 4. Git Initialization (root)

```
cd ..
git init
git add .
git commit -m "Initial hackathon boilerplate"
```

---

## 5. Run Locally

### Backend

```
cd backend
npm run dev
```

### Frontend

```
cd frontend
npm run dev
```

---

## 6. Deployment Mapping (for later)

* **frontend/** → Vercel root
* **backend/** → Railway root

End.
