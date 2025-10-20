import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'

// ESLint v9 Flat Config：区分浏览器与 Node 环境；忽略构建产物与旧配置文件
export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'docs/.vitepress/dist/**',
      'docs/public/**',
      'docs/.vitepress/cache/**',
      '.vitepress/cache/**',
      '.obsidian/**',
      '.githooks/**',
      'pnpm-lock.yaml',
      '.eslintrc.cjs',
      'uno.config.ts'
    ]
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  // 浏览器端代码（默认）
  {
    files: ['**/*.{js,cjs,mjs,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        Image: 'readonly',
        IntersectionObserver: 'readonly',
        MutationObserver: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'vue/multi-word-component-names': 'off',
      'vue/no-mutating-props': 'off'
    }
  },
  // Node 环境脚本（工具与服务端钩子）
  {
    files: [
      'docs/.vitepress/utils/**/*.js',
      'scripts/**/*.js'
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  }
]