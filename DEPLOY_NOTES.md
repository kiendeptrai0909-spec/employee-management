# Deploy notes

## 1) Database on Railway
Use the public TCP host/port from Railway, not the internal `*.railway.internal` host.

Render environment variables:

- `SPRING_DATASOURCE_URL=jdbc:mysql://YOUR_PUBLIC_HOST:YOUR_PUBLIC_PORT/railway?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Ho_Chi_Minh`
- `SPRING_DATASOURCE_USERNAME=root`
- `SPRING_DATASOURCE_PASSWORD=YOUR_RAILWAY_MYSQLPASSWORD`
- `SPRING_JPA_HIBERNATE_DDL_AUTO=update`
- `SPRING_JPA_SHOW_SQL=false`
- `SPRING_JPA_FORMAT_SQL=false`
- `APP_CORS_ALLOWED_ORIGIN_PATTERNS=http://localhost:5173,https://YOUR-FRONTEND.vercel.app,https://*.vercel.app`

## 2) Backend on Render
Create a Web Service from this GitHub repo.

- Root Directory: `backend`
- Deploy with Dockerfile in `backend/`
- Optional health check path: `/api/health`

## 3) Frontend on Vercel
Import the same repo, but set the project root to `frontend`.

Vercel environment variable:

- `VITE_API_BASE=https://YOUR-BACKEND.onrender.com`

The included `frontend/vercel.json` rewrites all routes to `index.html`, so React Router routes work after refresh.
