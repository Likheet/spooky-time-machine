# Time Travel Explorer - Project Setup

## Project Structure

```
kiro-project/
├── .kiro/
│   └── specs/
│       └── time-travel-explorer/
├── src/
│   ├── assets/          # Static assets (images, audio files)
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # Service classes (API, geocoding, audio)
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── public/
├── node_modules/
├── .prettierrc          # Prettier configuration
├── .prettierignore      # Prettier ignore patterns
├── eslint.config.js     # ESLint configuration
├── tsconfig.json        # TypeScript configuration
├── tsconfig.app.json    # TypeScript app configuration (strict mode enabled)
├── vite.config.ts       # Vite configuration
└── package.json         # Project dependencies and scripts
```

## Installed Dependencies

### Core Dependencies
- **react** (^19.2.0) - React library
- **react-dom** (^19.2.0) - React DOM rendering
- **@react-three/fiber** (^9.4.2) - React renderer for Three.js
- **@react-three/drei** (^10.7.7) - Useful helpers for React Three Fiber
- **three** (^0.181.2) - 3D graphics library
- **axios** (^1.13.2) - HTTP client for API calls
- **framer-motion** (^12.23.25) - Animation library

### Dev Dependencies
- **typescript** (~5.9.3) - TypeScript compiler
- **@types/three** (^0.181.0) - TypeScript types for Three.js
- **vite** (^7.2.4) - Build tool and dev server
- **eslint** (^9.39.1) - Code linting
- **eslint-config-prettier** (^10.1.8) - ESLint + Prettier integration
- **prettier** (^3.7.4) - Code formatting
- **@vitejs/plugin-react** (^5.1.1) - Vite React plugin

## Configuration

### TypeScript
- Strict mode enabled
- Target: ES2022
- Module: ESNext
- JSX: react-jsx
- Additional strict checks enabled (noUnusedLocals, noUnusedParameters, etc.)

### ESLint
- Configured with TypeScript support
- React hooks plugin enabled
- React refresh plugin for HMR
- Prettier integration to avoid conflicts

### Prettier
- Semi-colons: enabled
- Single quotes: enabled
- Print width: 100
- Tab width: 2
- Trailing commas: ES5

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run preview` - Preview production build

## Type Definitions

Core types have been defined in `src/types/index.ts`:
- `Coordinates` - Geographic coordinates
- `TimeSelection` - Time period selection
- `NotableEvent` - Historical event data
- `GeneratedImage` - AI-generated image data
- `AppState` - Application state
- `SoundEffect` - Audio effect enumeration

## Next Steps

The project is now ready for implementation of the remaining tasks:
1. Core data models and types ✓ (basic types created)
2. Halloween theme system
3. Audio system
4. Geocoding service
5. 3D globe component
6. Time selector component
7. State management
8. Notable events system
9. Prompt builder service
10. Gemini API integration
11. Image generation UI
12. Search functionality
13. UI polish and accessibility
14. Testing and QA
