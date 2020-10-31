export class SerializeError extends Error {
  constructor(message: string, public path: string) {
    super(message)
    this.name = 'SerializeError'
  }
}
