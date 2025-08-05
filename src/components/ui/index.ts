/**
 * This file re-exports components from their source files
 * to prevent import casing issues across the application
 */

// Re-export Button component
export { default as Button } from './Button';

// Re-export Card components
export { Card, CardContent, CardHeader } from './Card';

// Re-export Input component
export { default as Input } from './Input';

// Re-export Table components
export { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './table';

// Re-export GenericPlaceholderPage component
export { default as GenericPlaceholderPage } from './GenericPlaceholderPage';

// Re-export ApplicantInfoCard component - temporarily commented due to missing file
export { default as ApplicantInfoCard } from './ApplicantInfoCard';

// Re-export new UI components
export { default as ProgressStepper } from './ProgressStepper';
export { default as VerticalStepper } from './VerticalStepper';
export { default as StatsCardGroup } from './StatsCardGroup';
