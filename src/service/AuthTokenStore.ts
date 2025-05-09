export class AuthTokenStore {
    private readonly key = 'auth_token';
  
    async get(): Promise<string | undefined> {
      try {
        const token = localStorage.getItem(this.key);
        return token ?? undefined;
      } catch (error) {
        console.error('[AuthTokenStore] Failed to get token:', error);
        return undefined;
      }
    }
  
    async set(token: string): Promise<void> {
      try {
        if(token){
          localStorage.setItem(this.key, token);
        }
      } catch (error) {
        console.error('[AuthTokenStore] Failed to set token:', error);
      }
    }
  
    async clear(): Promise<void> {
      try {
        localStorage.removeItem(this.key);
      } catch (error) {
        console.error('[AuthTokenStore] Failed to clear token:', error);
      }
    }
  }
  