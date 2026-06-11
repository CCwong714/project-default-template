const viteEnv = import.meta.env as Record<string, unknown>

function readStringEnv(key: string, fallback: string) {
  const value = viteEnv[key]

  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }

  return fallback
}

export const env = {
  appName: readStringEnv('VITE_APP_NAME', 'Project Base'),
} as const
