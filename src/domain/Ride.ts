import crypto from "crypto";
import Coord from "./Coord";
import Segment from "./Segment";

export default class Ride {
  private constructor(
    readonly rideId: string,
    readonly passengerId: string,
    private segment: Segment,
    readonly status: string,
    readonly date: Date,
  ) {}

  static create(
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
  ) {
    return new Ride(
      crypto.randomUUID(),
      passengerId,
      new Segment(new Coord(fromLat, fromLong), new Coord(toLat, toLong)),
      "requested",
      new Date(),
    );
  }

  static restore(
    rideId: string,
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    status: string,
    date: Date,
  ) {
    return new Ride(
      rideId,
      passengerId,
      new Segment(new Coord(fromLat, fromLong), new Coord(toLat, toLong)),
      status,
      date,
    );
  }

  getFromLat() {
    return this.segment.from.getLat();
  }

  getFromLong() {
    return this.segment.from.getLong();
  }

  getToLat() {
    return this.segment.to.getLat();
  }

  getToLong() {
    return this.segment.to.getLong();
  }

  getDistance() {
    return this.segment.getDistance();
  }
}
