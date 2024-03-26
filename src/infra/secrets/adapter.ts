export abstract class ISecretAdapter {
  POSTGRES_HOST: string
  POSTGRES_PORT: number
  POSTGRES_DB: string
  POSTGRES_USER: string
  POSTGRES_PASSWORD: string
  POSTGRES_TZ: string
  JWT_SECRET_KEY: string
  TOKEN_EXPIRATION: string
  REDIS_URL: string
}
