# MMA Game

A React + Vite project for the MMA Game application.

## Development

To get started with development:

```bash
npm install
npm run dev
```

The development server will start at `http://localhost:5173`.

## Building

To build the project for production:

```bash
npm run build
```

The built files will be in the `dist` folder.

## GitHub Pages Deployment

This project is automatically deployed to GitHub Pages on every push to the `main` branch using GitHub Actions.

- **Live URL**: https://giovannihilaire01-cyber.github.io/MMA/
- **Configuration**: The project is configured to be deployed at `/MMA/` path (see `vite.config.js`)
- **Workflow**: The deployment is handled by `.github/workflows/deploy.yml`

The deployment process:
1. Builds the project using `npm run build`
2. Uploads the built artifacts to GitHub Pages
3. The site is available at the URL above

## ESLint

To check code quality:

```bash
npm run lint
```
