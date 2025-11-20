# Testing Guide

This document provides guidelines for testing the Samodogelogo project.

## Test Types

### Unit Tests

Unit tests focus on individual functions, components, and modules in isolation.

```bash
npm test                # Run all unit tests
npm test -- --watch     # Run tests in watch mode
npm test -- --coverage  # Run tests with coverage report
```

### Integration Tests

Integration tests verify that different parts of the system work together correctly.

```bash
npm run test:integration
```

### End-to-End Tests

E2E tests verify complete user flows through the application.

```bash
npm run test:e2e        # Run E2E tests
npm run test:e2e:ui     # Run E2E tests with UI
```

## Test Structure

### File Naming

- Unit tests: `*.test.ts` or `*.test.tsx`
- Integration tests: `*.integration.test.ts`
- E2E tests: `*.spec.ts`

### Directory Structure

```
src/
├── __tests__/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── modules/
    └── game/
        ├── GameEngine.ts
        └── __tests__/
            └── GameEngine.test.ts
```

## Writing Tests

### Unit Test Example

```typescript
import { add } from './math'

describe('Math utilities', () => {
  describe('add', () => {
    it('should add two numbers', () => {
      expect(add(1, 2)).toBe(3)
    })

    it('should handle negative numbers', () => {
      expect(add(-1, -2)).toBe(-3)
    })
  })
})
```

### Component Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

## Best Practices

1. **Write tests first** (TDD) when possible
2. **Test behavior, not implementation**
3. **Use descriptive test names**
4. **Keep tests simple and focused**
5. **Avoid test interdependence**
6. **Mock external dependencies**
7. **Aim for high coverage** (>80%)

## Tools

- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing
- **Playwright**: E2E testing
- **MSW**: API mocking
- **Vitest**: Fast unit testing

## CI/CD

Tests run automatically on:

- Every push to a branch
- Every pull request
- Before deployment

See `.github/workflows/test.yml` for CI configuration.
