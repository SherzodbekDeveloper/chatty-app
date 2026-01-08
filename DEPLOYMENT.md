# Deployment Guide - Chatty App

This guide will help you deploy the Chatty application to production.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB database (MongoDB Atlas or self-hosted)
- Cloudinary account (for image uploads)
- Domain name (optional but recommended)
- SSL certificate (for HTTPS)

## Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5001
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatty-app

# Client URL (Frontend) - Use your production domain
CLIENT_URL=https://your-domain.com,https://www.your-domain.com

# JWT Secret - Generate a strong random string
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### Frontend Environment Variables

Create a `.env.production` file in the `frontend/` directory:

```env
# API Base URL (leave empty to use relative paths, or set your API domain)
VITE_API_URL=

# App Environment
VITE_APP_ENV=production

# App Name
VITE_APP_NAME=Chatty
```

## Deployment Steps

### 1. Backend Deployment

#### Option A: Using PM2 (Recommended for VPS)

```bash
cd backend
npm install
npm run build  # If you have a build step
pm2 start src/index.js --name chatty-backend
pm2 save
pm2 startup
```

#### Option B: Using Docker

Create a `Dockerfile` in the `backend/` directory:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5001
CMD ["node", "src/index.js"]
```

Build and run:

```bash
docker build -t chatty-backend .
docker run -d -p 5001:5001 --env-file .env chatty-backend
```

#### Option C: Using Heroku

```bash
cd backend
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set CLIENT_URL=https://your-frontend-domain.com
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set CLOUDINARY_CLOUD_NAME=your-cloud-name
heroku config:set CLOUDINARY_API_KEY=your-api-key
heroku config:set CLOUDINARY_API_SECRET=your-api-secret
git push heroku main
```

### 2. Frontend Deployment

#### Option A: Using Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to frontend directory: `cd frontend`
3. Run: `vercel --prod`
4. Set environment variables in Vercel dashboard

#### Option B: Using Netlify

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Navigate to frontend directory: `cd frontend`
3. Build: `npm run build`
4. Deploy: `netlify deploy --prod --dir=dist`

#### Option C: Using Docker + Nginx

1. Build the frontend:

```bash
cd frontend
npm install
npm run build
```

2. Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io {
        proxy_pass http://backend:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

3. Create `Dockerfile`:

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Database Setup

1. Create a MongoDB database (MongoDB Atlas recommended)
2. Whitelist your server IP addresses
3. Create a database user with read/write permissions
4. Update `MONGODB_URI` in your backend `.env` file

### 4. SSL/HTTPS Setup

#### Using Let's Encrypt (Free SSL)

```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

#### Using Cloudflare

1. Add your domain to Cloudflare
2. Update DNS records
3. Enable SSL/TLS encryption mode to "Full"

### 5. Update SEO Meta Tags

Before deploying, update the meta tags in `frontend/index.html`:

- Replace `https://your-domain.com/` with your actual domain
- Add your Open Graph image
- Update Twitter card image

### 6. Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Frontend is built and deployed
- [ ] Environment variables are set correctly
- [ ] Database connection is working
- [ ] CORS is configured for production domain
- [ ] SSL certificate is installed
- [ ] Socket.IO connections are working
- [ ] Image uploads are working (Cloudinary)
- [ ] Health check endpoint is accessible
- [ ] Error logging is set up
- [ ] Monitoring is configured (optional)

## Production Optimizations

### Backend

1. **Enable Compression**: Install `compression` middleware
2. **Rate Limiting**: Add rate limiting to prevent abuse
3. **Logging**: Set up proper logging (Winston, Pino)
4. **Monitoring**: Use services like PM2 Plus, New Relic, or Datadog

### Frontend

1. **CDN**: Serve static assets from a CDN
2. **Caching**: Configure proper cache headers
3. **Analytics**: Add Google Analytics or similar
4. **Error Tracking**: Add Sentry or similar service

## Troubleshooting

### CORS Errors

- Ensure `CLIENT_URL` in backend includes your frontend domain
- Check that credentials are enabled in CORS config

### Socket.IO Connection Issues

- Verify WebSocket support on your hosting provider
- Check firewall settings
- Ensure `withCredentials: true` is set in frontend

### Database Connection Issues

- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has proper permissions

## Security Checklist

- [ ] JWT secret is strong and unique
- [ ] Environment variables are not committed to git
- [ ] HTTPS is enabled
- [ ] Security headers are configured
- [ ] Rate limiting is enabled
- [ ] Input validation is in place
- [ ] File upload size limits are set
- [ ] SQL injection prevention (if using SQL)
- [ ] XSS protection is enabled

## Support

For issues or questions, please check the application logs and error messages.
