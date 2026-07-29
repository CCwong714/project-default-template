type TAppEnv = {
  readonly VITE_APP_NAME?: string
}

const viteEnv = import.meta.env as TAppEnv

function readStringEnv(value: string | undefined, fallback: string) {
  if (value !== undefined && value.trim().length > 0) {
    return value
  }

  return fallback
}

export const env = {
  appName: readStringEnv(viteEnv.VITE_APP_NAME, 'Project Base'),
} as const
