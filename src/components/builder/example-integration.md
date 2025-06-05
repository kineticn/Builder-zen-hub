# Builder.io Component Integration Example

## When you receive Builder.io component code:

### 1. Save the component file

```typescript
// code/src/components/builder/BuilderHeroSection.tsx
import React from 'react';
import { tokens } from '@/design-tokens';

interface BuilderHeroSectionProps {
  title: string;
  subtitle: string;
}

export const BuilderHeroSection: React.FC<BuilderHeroSectionProps> = ({
  title,
  subtitle
}) => {
  return (
    <section
      className="py-20 px-6"
      style={{
        backgroundColor: tokens.colors.primary.navy[900],
        color: 'white'
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-xl opacity-80">{subtitle}</p>
      </div>
    </section>
  );
};

export default BuilderHeroSection;
```

### 2. Update the index file

```typescript
// code/src/components/builder/index.ts
export { default as BuilderHeroSection } from "./BuilderHeroSection";
```

### 3. Use in your BillBuddy pages

```typescript
// code/src/pages/Index.tsx
import { BuilderHeroSection } from '@/components/builder';

// Use the component
<BuilderHeroSection
  title="Welcome to BillBuddy"
  subtitle="Smart bill management for modern households"
/>
```

This ensures seamless integration with your existing architecture!
