# Component Patterns

## Component Structure

Components should follow these patterns:

1. **Single Responsibility**: Each component should do one thing well.
2. **Props Interface**: Define a clear interface for component props.
3. **Default Props**: Provide sensible defaults for optional props.
4. **Error Handling**: Handle potential errors gracefully.
5. **Loading States**: Show loading indicators when data is being fetched.

## Example Component

```tsx
import { useState } from 'react';
import { Service } from '@/types/models/Service';

interface ServiceCardProps {
  service: Service;
  onBook?: (serviceId: string) => void;
  isCompact?: boolean;
}

export function ServiceCard({ 
  service, 
  onBook, 
  isCompact = false 
}: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleBook = () => {
    if (onBook) {
      onBook(service.id);
    }
  };
  
  return (
    <div 
      className={`p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all ${isHovered ? 'translate-y-[-5px]' : ''} border border-gray-100`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
          {/* Icon would go here */}
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-1">{service.name}</h3>
          {!isCompact && <p className="text-gray-600">{service.description}</p>}
          <p className="text-gray-600">From ${service.startingPrice}</p>
        </div>
      </div>
      
      {onBook && (
        <button 
          onClick={handleBook}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Book Now
        </button>
      )}
    </div>
  );
}
```

## Component Organization

1. **Feature-Based**: Components should be organized by feature.
2. **Index Exports**: Use index files to export components from a directory.
3. **Shared Components**: Common components should be in the shared components directory.

## Styling

1. **Tailwind CSS**: Use Tailwind for styling.
2. **Responsive Design**: All components should be responsive.
3. **Theme Consistency**: Follow the application's color scheme and design system.

## Performance

1. **Memoization**: Use React.memo for expensive components.
2. **Lazy Loading**: Use dynamic imports for code splitting.
3. **Virtualization**: Use virtualization for long lists.
