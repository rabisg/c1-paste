# Development Guide

## Prerequisites

- Node.js 18+
- pnpm

## Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Deployment to GitHub Pages

### Prerequisites

1. **Enable GitHub Pages**: Go to your repository settings and enable GitHub Pages with "GitHub Actions" as the source.

### Automatic Deployment

1. **Push to main branch**: The GitHub Actions workflow will automatically build and deploy the application.
2. **Access your site**: Visit `https://yourusername.github.io/c1-paste/`

### Manual Deployment

If you need to deploy manually:

```bash
# Build the project
pnpm build

# The dist/ folder contains the static files ready for deployment
```

## Technical Details

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **UI Components**: `@thesysai/genui-sdk` and `@crayonai/react-ui`
- **Styling**: Minimal CSS with clean, functional design
- **Deployment**: GitHub Actions workflow for automatic deployment

## File Structure

```
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # React entry point
│   └── index.css        # Minimal styling
├── .github/workflows/
│   └── deploy.yml       # GitHub Actions deployment
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── index.html           # HTML template
```

## Configuration

### Vite Configuration

The `vite.config.ts` is configured for GitHub Pages deployment:

- `base: "/c1-paste/"` - Sets the correct base path for GitHub Pages
- `outDir: "dist"` - Output directory for built files

### GitHub Actions

The deployment workflow (`.github/workflows/deploy.yml`) automatically:

1. Installs dependencies with pnpm
2. Builds the project
3. Deploys to GitHub Pages

## Troubleshooting

### Build Issues

- Ensure all dependencies are installed: `pnpm install`
- Check TypeScript errors: `pnpm build`

### Deployment Issues

- Verify GitHub Pages is enabled in repository settings
- Check GitHub Actions workflow status in the Actions tab
- Ensure the workflow has proper permissions (contents: read, pages: write, id-token: write)
