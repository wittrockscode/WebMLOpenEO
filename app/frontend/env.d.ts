/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_NODE_BACKEND_URI: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}