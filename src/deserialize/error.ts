export class DeserializeError extends Error {
  constructor(message: string, public path: string) {
    super(message)
    this.name = 'DeserializeError'
  }
}
