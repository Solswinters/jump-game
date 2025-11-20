# Contributing Guide

Thank you for your interest in contributing to Jump Game!

## Code of Conduct

Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/jump-game.git
   cd jump-game
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### 1. Make Changes

```bash
# Start development server
npm run dev

# Run tests in watch mode
npm run test:watch
```

### 2. Test Your Changes

```bash
# Run all tests
npm run test

# Run E2E tests
npm run test:e2e

# Check types
npm run type-check

# Lint code
npm run lint
```

### 3. Commit Your Changes

We use Conventional Commits:

```bash
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
git commit -m "docs: update documentation"
git commit -m "test: add tests"
git commit -m "refactor: improve code"
git commit -m "chore: update dependencies"
```

### 4. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Examples

```
feat(game): add power-up system

Implement shield and speed boost power-ups
with visual effects and sound.

Closes #123
```

```
fix(wallet): resolve connection timeout issue

Increase timeout and add retry logic for
wallet connection failures.

Fixes #456
```

## Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all tests pass**
4. **Follow code style** guidelines
5. **Keep PRs focused** - one feature/fix per PR
6. **Write clear PR description**

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

How to test the changes

## Screenshots (if applicable)

Add screenshots for UI changes

## Checklist

- [ ] Tests pass
- [ ] Types checked
- [ ] Linting passes
- [ ] Documentation updated
```

## Code Style

### TypeScript

- Use TypeScript for all new code
- Add type annotations where helpful
- Avoid `any` type
- Use strict mode

```typescript
// Good
function add(a: number, b: number): number {
  return a + b
}

// Bad
function add(a: any, b: any) {
  return a + b
}
```

### React Components

- Use functional components
- Use TypeScript interfaces for props
- Extract reusable logic into hooks
- Keep components small and focused

```typescript
interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}

export const Button: FC<ButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
}) => {
  return (
    <button className={cn('btn', `btn-${variant}`)} onClick={onClick}>
      {children}
    </button>
  )
}
```

### File Naming

- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts`
- Utils: `kebab-case.ts`
- Types: `PascalCase.ts` or `types.ts`

### Directory Structure

```
src/
├── components/
│   └── Button/
│       ├── Button.tsx
│       ├── Button.test.tsx
│       ├── Button.stories.tsx
│       └── index.ts
```

## Testing Guidelines

### Unit Tests

- Test pure functions
- Test component behavior
- Mock external dependencies
- Aim for 80%+ coverage

```typescript
describe('add', () => {
  it('should add two numbers', () => {
    expect(add(2, 3)).toBe(5)
  })

  it('should handle negative numbers', () => {
    expect(add(-2, 3)).toBe(1)
  })
})
```

### Component Tests

```typescript
describe('Button', () => {
  it('should render children', () => {
    render(<Button onClick={() => {}}>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should call onClick when clicked', () => {
    const onClick = jest.fn()
    render(<Button onClick={onClick}>Click me</Button>)
    fireEvent.click(screen.getByText('Click me'))
    expect(onClick).toHaveBeenCalled()
  })
})
```

### E2E Tests

```typescript
test('should complete game flow', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Play Game')
  await page.waitForSelector('.game-canvas')
  // Test game interactions
})
```

## Documentation

- Add JSDoc comments for public APIs
- Update README for new features
- Add examples for complex features
- Keep docs up-to-date with code

```typescript
/**
 * Calculate the score based on obstacles passed and combo multiplier
 * @param obstacles - Number of obstacles passed
 * @param combo - Current combo multiplier
 * @returns The calculated score
 */
export function calculateScore(obstacles: number, combo: number): number {
  return obstacles * 10 * combo
}
```

## Architecture Decisions

For major changes:

1. **Open an issue** to discuss
2. **Explain the problem** and proposed solution
3. **Get feedback** from maintainers
4. **Update documentation** after implementation

## Performance Considerations

- Use `React.memo` for expensive components
- Implement code splitting for large features
- Optimize images and assets
- Profile before optimizing

## Security

- Sanitize user input
- Validate all data
- Don't commit secrets
- Use environment variables

## Accessibility

- Use semantic HTML
- Add ARIA labels
- Test with keyboard
- Test with screen readers

## Browser Support

Support latest 2 versions of:

- Chrome
- Firefox
- Safari
- Edge

## Questions?

- Open an issue
- Ask in discussions
- Check existing documentation

Thank you for contributing!
