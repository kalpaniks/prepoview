# Next.js Frontend Architecture Learning Guide

## Project Overview

We're building a GitHub private repository sharing platform where users can view shared repositories with a file tree and code editor interface securely without worrying thier code can be stolen.

## Next.js Key Concepts We'll Use

### 1. App Router (Next.js 15+)

- **File-based routing**: Our route `/share/[shareId]` is created by the folder structure `app/share/[shareId]/page.tsx`
- **Dynamic routes**: `[shareId]` is a dynamic segment that captures the share ID from the URL
- **Layout system**: Nested layouts for consistent UI structure

### 2. Server Components vs Client Components

- **Server Components** (default): Render on the server, great for data fetching
- **Client Components**: Use `"use client"` directive, needed for interactivity (like Monaco Editor)

### 3. Data Fetching Patterns

- **Server-side fetching**: Using `fetch()` in Server Components
- **Client-side fetching**: Using hooks like `useEffect` with fetch or SWR/React Query

## Frontend Architecture Plan

### Route Structure

```
/share/[shareId]
├── File Tree (left sidebar)
├── Monaco Editor (main content)
└── Loading states & error handling
```

### Component Architecture

```
SharePage (Server Component)
├── ShareLayout (Client Component)
    ├── FileTree (Client Component)
    ├── CodeEditor (Client Component)
    └── LoadingSpinner (Client Component)
```

### State Management Strategy

- **Local State**: React useState for UI state (selected file, loading states)
- **Server State**: API routes for data fetching
- **URL State**: Store selected file in URL parameters for shareability

### API Integration

- `GET /api/share/[shareId]/tree` - Fetch repository file tree
- `GET /api/share/[shareId]/file?path=...` - Fetch individual file content

## Implementation Steps

### Phase 1: Basic Structure

1. Create the share page layout
2. Set up basic file tree component
3. Set up Monaco Editor component

### Phase 2: Data Integration

1. Connect to backend APIs
2. Implement file tree data fetching
3. Implement file content fetching

### Phase 3: User Experience

1. Add loading states
2. Add error handling
3. Add URL state management
4. Optimize performance

## Next.js Patterns We'll Learn

1. **Dynamic Routing**: How `[shareId]` works
2. **Client/Server Component Boundaries**: When to use each
3. **API Routes**: How to create and consume them
4. **Loading and Error States**: Built-in Next.js features
5. **TypeScript Integration**: Type safety across the stack

## Best Practices We'll Follow

1. **Component Composition**: Small, focused components
2. **Separation of Concerns**: Logic separated from UI
3. **Error Boundaries**: Graceful error handling
4. **Accessibility**: Proper ARIA labels and keyboard navigation
5. **Performance**: Code splitting and lazy loading
