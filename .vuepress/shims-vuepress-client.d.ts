declare module 'vuepress/client' {
  import type { Router } from 'vue-router';

  export interface EnhanceContext {
    app: any;
    router: Router;
    siteData: any;
  }

  export interface ClientConfig {
    enhance?: (ctx: EnhanceContext) => void | Promise<void>;
    setup?: () => void | Promise<void>;
    rootComponents?: any[];
  }

  export function defineClientConfig(config: ClientConfig): ClientConfig;
}