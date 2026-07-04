import { DatabaseInterface, QueryOptions, QueryResult, InsertResult, UpdateResult, DeleteResult } from './types';
import { supabase } from './client';

export const supabaseDatabaseService: DatabaseInterface = {
  async select<T>(table: string, options: QueryOptions = {}): Promise<QueryResult<T>> {
    let query = supabase.from(table).select(options.select?.join(',') || '*');

    if (options.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else if (value === null) {
          query = query.is(key, null);
        } else {
          query = query.eq(key, value);
        }
      });
    }

    if (options.order) {
      query = query.order(options.order.column, { ascending: options.order.ascending ?? true });
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    if (options.single) {
      const { data, error } = await query.maybeSingle();
      return { data: data as T | null, error: error?.message };
    }

    const { data, error, count } = await query;
    return { data: data as T[], error: error?.message, count: count ?? undefined };
  },

  async insert<T>(table: string, data: Partial<T>): Promise<InsertResult<T>> {
    const { data: result, error } = await supabase.from(table).insert(data).select().single();
    if (error) {
      return { error: error.message };
    }
    return { data: result as T };
  },

  async update<T>(table: string, id: string, data: Partial<T>): Promise<UpdateResult<T>> {
    const { data: result, error } = await supabase.from(table).update(data).eq('id', id).select().single();
    if (error) {
      return { error: error.message };
    }
    return { data: result as T };
  },

  async delete(table: string, id: string): Promise<DeleteResult> {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  },

  async upsert<T>(table: string, data: Partial<T>, conflictKey = 'id'): Promise<InsertResult<T>> {
    const { data: result, error } = await supabase
      .from(table)
      .upsert(data, { onConflict: conflictKey })
      .select()
      .single();
    if (error) {
      return { error: error.message };
    }
    return { data: result as T };
  },

  async rpc<T>(fn: string, args: Record<string, unknown> = {}): Promise<QueryResult<T>> {
    const { data, error } = await supabase.rpc(fn, args);
    return { data: data as T, error: error?.message };
  },

  subscribe(table: string, callback: (payload: unknown) => void): () => void {
    const channel = supabase
      .channel(`${table}-changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  },
};

// Exporta el cliente para funciones adicionales como invoke
export { supabase } from './client';
