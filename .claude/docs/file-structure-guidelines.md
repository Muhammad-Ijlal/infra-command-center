# File Structure Guidelines

## Recommended Approach: Feature-Based Organization

This project uses a **hybrid approach** that prioritizes feature-based organization for complex features while maintaining type-based organization for shared resources.

## When to Use Feature-Based Structure

Use feature-based organization when:
- ✅ Feature has 3+ components
- ✅ Feature has custom hooks
- ✅ Feature has specific business logic
- ✅ Feature is relatively self-contained
- ✅ Feature has its own API endpoints

## Recommended Feature Structure

```
src/features/[feature-name]/
├── components/            # Feature-specific components
├── hooks/                 # Feature-specific hooks
├── services/              # Feature API calls and business logic
├── stores/                # Feature state (if using Zustand)
├── utils/                 # Feature-specific utilities
├── types/                 # Feature-specific types
├── constants/             # Feature constants
├── __tests__/             # Feature tests
└── index.ts               # Public API exports
```

## For Existing Components

When working with existing components, **group related files near the component** even if they're currently in global directories:

- Move component-specific hooks from `src/hooks/` to be near the component
- Move component-specific utilities from `src/utils/` to be near the component
- Move component-specific stores from `src/stores/` to be near the component
- Co-locate types and constants that are only used by specific components

## Implementation Strategy

1. **For new features:** Always use feature-based structure
2. **For existing code:** Gradually migrate when making modifications
3. **Co-locate related code:** Keep feature code together for better maintainability
4. **Create public APIs:** Use index files to expose clean interfaces

## Global vs Feature-Specific

Keep in global directories only when truly shared:
- Reusable UI components (`src/components/ui/`)
- Shared utilities across multiple features
- Global state management
- Common constants and types

## Benefits

- Better maintainability through co-location
- Clearer feature boundaries
- Easier refactoring and testing
- Improved team collaboration
- Reduced coupling between features