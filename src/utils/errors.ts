export class FetchError extends Error {
  public readonly name = 'FetchError';
  public readonly timestamp: Date;

  constructor(
    message: string,
    public readonly status: number,
    public readonly data?: unknown
  ) {
    super(message);
    this.timestamp = new Date();
    
    Object.setPrototypeOf(this, FetchError.prototype);
  }

  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      data: this.data,
      timestamp: this.timestamp
    };
  }
}
