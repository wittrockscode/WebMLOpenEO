# Frontend

## Usage

### Recommended IDE Setup for Development

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

### Running with Docker

The Dockerfile excpects some environment variables provided by the docker-compose.yml in the root of the project, so the frontend can not be started with docker as a standalone.

### Running without Docker

1. Make sure node.js is installed on your system.
2. Navigate to ``/WebMLOpenEO/app/frontend`` in your terminal.
3. Run the following command to install all dependencies:

```bash
npm install
```
4. Compile and Hot-Reload for Development

```bash
npm run dev
```

5. Type-Check, Compile and Minify for Production

```bash
npm run build
```

5. Lint with [ESLint](https://eslint.org/)

```bash
npm run lint
```

## Testing

We have decided to not implement any tests for the frontend, because a big part of it is just displaying provided data. Full-blown end-to-end tests would have been possible, but are not worth the effort in our eyes.