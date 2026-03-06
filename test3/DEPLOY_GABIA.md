# test3 gabia deployment

This project is designed to run on one server with:

- Next.js frontend on `127.0.0.1:3000`
- FastAPI backend on `127.0.0.1:8000`
- Nginx on port `80`
- MySQL on the same server

## 1. Required runtime versions

- Node.js 20 LTS recommended
- Python 3.10+ recommended
- MySQL 8 recommended

## 2. Environment files

Backend: copy `backend/.env.example` to `backend/.env`

Frontend production: copy `frontend/.env.production.example` to `frontend/.env.production`

## 3. Production networking

- Public URL: `http://1.201.125.195`
- Frontend proxy target: `127.0.0.1:3000`
- Backend proxy target: `127.0.0.1:8000`
- MySQL should not be exposed publicly

## 4. Service templates

- Nginx config: `deploy/nginx/test3.conf`
- Backend systemd unit: `deploy/systemd/test3-backend.service`
- Frontend systemd unit: `deploy/systemd/test3-frontend.service`

Update the `User=` value in both systemd files before enabling them.
