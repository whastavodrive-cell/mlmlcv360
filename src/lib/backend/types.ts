// Abstract interfaces for backend services - backend-agnostic

export interface User {
  id: string;
  email: string;
  emailConfirmed: boolean;
  createdAt: string;
  lastSignInAt?: string;
  metadata?: Record<string, unknown>;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: User;
}

export interface AuthResult {
  success: boolean;
  session?: Session;
  error?: string;
}

export interface FileUploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export interface FileMetadata {
  name: string;
  size: number;
  contentType: string;
  url: string;
  createdAt?: string;
}

export interface QueryOptions {
  select?: string[];
  filter?: Record<string, unknown>;
  order?: { column: string; ascending?: boolean };
  limit?: number;
  offset?: number;
  single?: boolean;
}

export interface QueryResult<T> {
  data: T[] | T | null;
  error?: string;
  count?: number;
}

export interface InsertResult<T> {
  data?: T;
  error?: string;
}

export interface UpdateResult<T> {
  data?: T;
  error?: string;
}

export interface DeleteResult {
  success: boolean;
  error?: string;
}

export interface AuthInterface {
  signUp(email: string, password: string, metadata?: Record<string, unknown>): Promise<AuthResult>;
  signIn(email: string, password: string): Promise<AuthResult>;
  signInWithOAuth(provider: string): Promise<{ url?: string; error?: string }>;
  signOut(): Promise<{ error?: string }>;
  getSession(): Promise<Session | null>;
  getUser(): Promise<User | null>;
  updateUser(metadata: Record<string, unknown>): Promise<AuthResult>;
  resetPassword(email: string): Promise<{ error?: string }>;
  updatePassword(newPassword: string): Promise<{ error?: string }>;
  onAuthStateChange(callback: (event: string, session: Session | null) => void): () => void;
}

export interface StorageInterface {
  upload(bucket: string, path: string, file: File | Blob): Promise<FileUploadResult>;
  download(bucket: string, path: string): Promise<Blob | null>;
  getPublicUrl(bucket: string, path: string): string;
  list(bucket: string, path?: string): Promise<FileMetadata[]>;
  remove(bucket: string, paths: string[]): Promise<DeleteResult>;
  exists(bucket: string, path: string): Promise<boolean>;
}

export interface DatabaseInterface {
  select<T>(table: string, options?: QueryOptions): Promise<QueryResult<T>>;
  insert<T>(table: string, data: Partial<T>): Promise<InsertResult<T>>;
  update<T>(table: string, id: string, data: Partial<T>): Promise<UpdateResult<T>>;
  delete(table: string, id: string): Promise<DeleteResult>;
  upsert<T>(table: string, data: Partial<T>, conflictKey?: string): Promise<InsertResult<T>>;
  rpc<T>(fn: string, args?: Record<string, unknown>): Promise<QueryResult<T>>;
  subscribe(table: string, callback: (payload: unknown) => void): () => void;
}

export interface BackendServices {
  auth: AuthInterface;
  storage: StorageInterface;
  database: DatabaseInterface;
  config: DatabaseInterface;
}

export interface ExportData {
  version: string;
  exportedAt: string;
  tables: Record<string, unknown[]>;
  storage: Record<string, FileMetadata[]>;
  auth: {
    users: Pick<User, 'id' | 'email' | 'emailConfirmed' | 'createdAt'>[];
  };
}
