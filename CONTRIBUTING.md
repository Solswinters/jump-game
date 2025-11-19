# Contributing Guide

Thank you for considering contributing to this project!

## Development Setup

1. **Fork and clone the repository**

```bash
git clone https://github.com/yourusername/samodogelogo.git
cd samodogelogo
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Run development server**

```bash
npm run dev
```

## Code Standards

### TypeScript

- Use strict mode
- Avoid `any` types
- Use branded types for IDs and addresses
- Document complex type definitions

### React

- Prefer functional components
- Use hooks for state management
- Keep components under 200 lines
- Extract reusable logic into custom hooks

### Naming Conventions

- Components: PascalCase (`GameEngine.tsx`)
- Functions/Variables: camelCase (`calculateScore`)
- Constants: UPPER_SNAKE_CASE (`MAX_PLAYERS`)
- Files: kebab-case for utilities (`physics-engine.ts`)

### File Organization

```
src/
├── modules/          # Feature modules
│   ├── game/
│   ├── wallet/
│   └── multiplayer/
├── shared/           # Shared utilities
├── stores/           # Zustand stores
└── types/            # TypeScript types
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

**Examples:**

```
feat: add double jump power-up
fix: correct collision detection on moving platforms
docs: update API documentation for wallet module
test: add tests for physics engine
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all tests pass: `npm test`
4. Ensure linting passes: `npm run lint`
5. Update documentation if needed
6. Submit PR with clear description

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

How was this tested?

## Checklist

- [ ] Tests pass
- [ ] Linting passes
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Code Review

All submissions require review. We use GitHub pull requests for this purpose.

- Be respectful and constructive
- Explain your reasoning
- Be open to feedback
- Keep discussions focused on code

## Questions?

Feel free to open an issue for questions or discussions!
