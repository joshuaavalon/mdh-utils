export class InvalidImageError extends Error {
  public constructor() {
    super("Not recognizable image type");
  }
}
