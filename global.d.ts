declare module "*.css"
export {}

declare global {
  interface Window {
    latestOutput: string
  }
}