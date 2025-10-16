declare module 'vue-router' {
  export interface Router {
    push: (...args: any[]) => Promise<unknown>;
    replace?: (...args: any[]) => Promise<unknown>;
  }
  export type RouteLocationRaw = any;
}