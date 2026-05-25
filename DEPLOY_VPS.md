# Deploy VPS

This project now includes a GitHub Action at `.github/workflows/deploy-vps.yml`.

## What the workflow does

On `push` to `main` or via manual trigger:

1. installs frontend dependencies
2. builds the Vite frontend
3. validates the backend install
4. uploads `frontend/dist` to your VPS
5. uploads the backend source to your VPS
6. runs Prisma generate + Prisma migrate deploy on the VPS
7. executes your backend restart command

## GitHub secrets to add

Add these repository secrets in GitHub:

- `VPS_HOST`: server IP or domain
- `VPS_PORT`: SSH port, usually `22`
- `VPS_USER`: SSH user
- `VPS_SSH_KEY`: private SSH key used by GitHub Actions
- `VPS_APP_DIR`: remote app directory, for example `/var/www/hapto`
- `VPS_RESTART_COMMAND`: command used to restart the backend

## Example restart commands

If you use PM2:

```bash
pm2 describe hapto-api >/dev/null 2>&1 && pm2 restart hapto-api || pm2 start npm --name hapto-api -- start
```

If you use systemd:

```bash
sudo systemctl restart hapto-api
```

## Expected structure on the VPS

The workflow deploys into:

```text
${VPS_APP_DIR}/frontend/dist
${VPS_APP_DIR}/backend
```

Your backend `.env` file must already exist on the VPS at:

```text
${VPS_APP_DIR}/backend/.env
```

The workflow does not upload `.env` files.

## Server prerequisites

Your VPS should already have:

- Node.js installed
- npm installed
- your database available
- the backend `.env` file created
- PM2 or systemd configured if you want automatic restart

## Suggested Nginx setup

- serve the frontend from `${VPS_APP_DIR}/frontend/dist`
- proxy API requests to your Node backend port
- increase upload size for product/blog images, for example `client_max_body_size 10M;`

Example inside your Nginx `server` block or the `/api/` location:

```nginx
client_max_body_size 10M;
```

## Backend notes

I also added:

- `backend` script `start`
- `backend` script `prisma:generate`
- `backend` script `prisma:migrate:deploy`
- explicit `dotenv` dependency for production installs
