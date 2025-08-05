# Vercel Deployment Guide

This document provides instructions for deploying your application to Vercel.

## Environment Variables

Your application requires these environment variables to be set in the Vercel dashboard:

### Firebase Configuration
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_DATABASE_URL`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

### Wialon Configuration
- `VITE_WIALON_SESSION_TOKEN`
- `VITE_WIALON_API_URL`
- `VITE_WIALON_LOGIN_URL`

### Maps Configuration
- `VITE_MAPS_API_KEY`
- `VITE_GOOGLE_MAPS_API_KEY`
- `VITE_MAPS_SERVICE_URL`

### GCP Configuration
- `VITE_CLOUD_RUN_URL`
- `VITE_CLOUD_RUN_URL_ALTERNATIVE`
- `VITE_GCP_CONSOLE_URL`

### Other Settings
- `VITE_ENV_MODE` = "production"
- `VITE_USE_EMULATOR` = "false"

## How to Set Up Deployment

1. Create an account at [Vercel](https://vercel.com)
2. Install the Vercel CLI: `npm i -g vercel`
3. Connect your repository to Vercel:
   - `vercel login`
   - `vercel link` (in your project directory)
4. Set up environment variables:
   - Use the Vercel dashboard UI to add all variables listed above
   - Alternatively, use CLI: `vercel env add VITE_FIREBASE_API_KEY production`
5. Deploy your application:
   - `vercel --prod`

## Automatic Deployments

Once connected to Vercel, your application will automatically deploy when you push to the main branch.

## Development Commands

- Preview deployment: `vercel`
- Production deployment: `vercel --prod`
- Show environment variables: `vercel env ls`

## Migrating from Netlify

When migrating from Netlify to Vercel:

1. Export your environment variables from Netlify
2. Import them into Vercel's environment variables section
3. Update any deployment scripts or CI/CD workflows
4. Update DNS records to point to Vercel's deployment

## Vercel vs Netlify Features

Vercel provides:
- Faster global deployments with edge network
- Better integration with Next.js (if you plan to migrate)
- Serverless functions with improved cold start times
- More generous free tier limits for commercial projects
