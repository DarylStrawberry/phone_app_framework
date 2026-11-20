export interface KeyValueStorage {
  getString(key: string): Promise<string | null>;
  setString(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}
