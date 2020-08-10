# run-env
Run package.json scripts suffixed with NODE_ENV.

### CLI Usage

Assume the following package.json:
```json
...
"scripts": {
  "build:dev": "...",
  "build:prod": "...",
  "build": "..."
},
...
```
This will run any script that ends with `:${NODE_ENV}`. If there is no match, it will also accept suffixes that match at least the first 3 characters of NODE_ENV (ex: `build:dev` will match `NODE_ENV=development`). As a final fallback, an exact match will be run.
```bash
yarn run-env build

# NODE_ENV=development -> yarn run build:dev
# NODE_ENV=production -> yarn run build:prod
# NODE_ENV=local -> yarn run build
```

Additionally, and environment variables listed in `.env` will be loaded before running.

#### Programmatic Usage

```ts
runEnv(script: string) => Promise<SpawnSyncReturns<Buffer>>;
```

```ts
import runEnv from "run-env";

runEnv("build");
```
