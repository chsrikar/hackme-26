# HackMe'26 - Vercel Deployment Guide

This guide will help you deploy the HackMe'26 website to Vercel.

## Prerequisites

- A [Vercel](https://vercel.com) account
- Git repository (GitHub, GitLab, or Bitbucket)

## Quick Deploy

### Option 1: Deploy via Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [Vercel Dashboard](https://vercel.com/new)
3. Click "Import Project"
4. Select your repository
5. Vercel will automatically detect the Vite configuration
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Navigate to your project directory:
   ```bash
   cd hackme26
   ```

3. Run the Vercel deploy command:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy: Yes
   - Which scope: Select your account
   - Link to existing project: No
   - Project name: hackme26 (or your preferred name)
   - Directory: ./ (press Enter)
   - Override settings: No

5. For production deployment:
   ```bash
   vercel --prod
   ```

## Build Configuration

The project uses Vite and is automatically configured for Vercel deployment:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Environment Variables

No environment variables are required for this static site.

## Custom Domain

To add a custom domain:

1. Go to your project in Vercel Dashboard
2. Navigate to Settings > Domains
3. Add your custom domain
4. Follow the DNS configuration instructions

## Deployment Features

- ✅ Automatic builds on Git push
- ✅ Preview deployments for pull requests
- ✅ Global CDN distribution
- ✅ HTTPS by default
- ✅ Automatic optimizations
- ✅ SPA routing support (via vercel.json)

## Troubleshooting

### Build Fails

If the build fails, check:
- All dependencies are listed in package.json
- Node version compatibility (Vercel uses Node 18.x by default)
- Run `npm run build` locally to verify it works

### Routes Not Working

The `vercel.json` file is configured to handle client-side routing. If routes don't work:
- Ensure `vercel.json` is in the root directory
- Verify the rewrite rules are correct

### Images Not Loading

If images from the public folder don't load:
- Ensure images are in the `public` folder
- Use absolute paths starting with `/` (e.g., `/background.png`)

## Local Development

To run the project locally:

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to view the site.

## Production Build

To test the production build locally:

```bash
npm run build
npm run preview
```

## Support

For Vercel-specific issues, visit:
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

For project-specific issues, contact the HackMe'26 team.

---

**Last Updated**: December 2024  
**Framework**: React + Vite  
**Deployment Platform**: Vercel
