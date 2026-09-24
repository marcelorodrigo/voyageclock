export class InvalidTripInput extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidTripInput'
  }
}

export class NonexistentLocalTime extends InvalidTripInput {
  constructor(field: string) {
    super(`${field} does not exist because of a daylight-saving time change.`)
    this.name = 'NonexistentLocalTime'
  }
}

export class AmbiguousLocalTime extends InvalidTripInput {
  constructor(field: string) {
    super(`${field} occurs twice because of a daylight-saving time change. Choose another time.`)
    this.name = 'AmbiguousLocalTime'
  }
}

export class DepartureInPast extends InvalidTripInput {
  constructor() {
    super('Departure must be in the future.')
    this.name = 'DepartureInPast'
  }
}
