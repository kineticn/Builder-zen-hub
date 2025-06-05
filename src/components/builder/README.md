# Builder.io Integration for BillBuddy

## Directory Structure

This directory contains all Builder.io generated components and assets for the BillBuddy application.

### Structure

```
/src/components/builder/     - Builder.io generated UI components
/src/pages/builder/          - Builder.io generated pages (if any)
/public/builder/             - Static assets from Builder.io
/src/assets/builder/         - Builder.io specific assets
```

## Integration Guidelines

### 1. Component Naming Convention

- Use PascalCase for component names
- Prefix with `Builder` if needed for clarity
- Example: `BuilderHeroSection.tsx`, `BuilderPricingCard.tsx`

### 2. Import Path Strategy

```typescript
// Import Builder.io components
import { BuilderComponent } from "./components/builder/ComponentName";

// Import existing BillBuddy components
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
```

### 3. Design Token Integration

Ensure Builder.io components use BillBuddy design tokens:

```typescript
import { tokens } from '@/design-tokens';

// Use existing color palette
style={{
  backgroundColor: tokens.colors.primary.navy[900],
  color: tokens.colors.primary.teal[400]
}}
```

### 4. TypeScript Integration

- All Builder.io components should have proper TypeScript interfaces
- Follow existing BillBuddy patterns for props and state
- Use existing utility types where applicable

### 5. Responsive Design

- Ensure Builder.io components follow mobile-first approach
- Use existing breakpoint system
- Test across all device sizes

## Component Integration Checklist

- [ ] Component follows BillBuddy naming conventions
- [ ] Uses design tokens for styling consistency
- [ ] Has proper TypeScript interfaces
- [ ] Includes responsive design
- [ ] Tested with existing BillBuddy components
- [ ] No styling conflicts with existing UI
- [ ] Follows accessibility standards
- [ ] Integrated with existing state management if needed

## Notes

This integration maintains separation between Builder.io generated content and core BillBuddy application logic while allowing seamless integration when needed.
