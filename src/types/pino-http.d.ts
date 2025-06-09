declare module 'http' {
  interface ServerResponse {
    responseTime?: number;
  }
}
