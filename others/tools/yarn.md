# yarn

配置不需要代理和禁用 lockfile:

```
yarn config delete https-proxy
yarn config delete proxy
yarn install --no-lockfile
```
