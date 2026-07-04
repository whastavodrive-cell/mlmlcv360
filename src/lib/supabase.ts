// Re-export everything from the backend abstraction layer
// This maintains backward compatibility while using the new architecture
export { supabase } from '@/lib/backend';
export type { Profile, UserRole, MlmRank, MlmPlan, UserStatus } from '@/lib/backend';
