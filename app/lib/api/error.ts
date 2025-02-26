export class ApiError extends Error {
  public code: number;
  public description: string | undefined;

  constructor(message: string, code: number, description?: string) {
    super(message);
    this.code = code;
    this.description = description;
  }
}
