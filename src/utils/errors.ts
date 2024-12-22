export class FetchError extends Error {
  constructor(message: string, public status: number, public data?: unknown) {
    super(message);
    this.name = "FetchError";
  }
}
