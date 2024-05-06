import crypto from "crypto";
import Coord from "./Coord";

export default class Ride {
  private constructor(
    readonly rideId: string,
    readonly passengerId: string,
    private from: Coord,
    private to: Coord,
    readonly status: string,
    readonly date: Date
  ) {}

  static create( passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
    return new Ride(
      crypto.randomUUID(),
      passengerId,
      new Coord(fromLat, fromLong),
      new Coord(toLat, toLong),
      "requested",
      new Date()
    );
  }

  static restore(rideId: string, passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number, status: string, date: Date) {
    return new Ride(
      rideId,
      passengerId,
      new Coord(fromLat, fromLong),
      new Coord(toLat, toLong),
      status,
      date
    );
  }

  getFromLat () {
		return this.from.getLat();
	}

	getFromLong () {
		return this.from.getLong();
	}

	getToLat () {
		return this.to.getLat();
	}

	getToLong () {
		return this.to.getLong();
	}
}
