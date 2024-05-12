import crypto from "crypto";
import Coord from "./Coord";
import Segment from "./Segment";

export default class Ride {
  private constructor(
    readonly rideId: string,
    readonly passengerId: string,
    public driverId: string,
    private segment: Segment,
    private status: string,
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
      "",
      new Segment(new Coord(fromLat, fromLong), new Coord(toLat, toLong)),
      "requested",
      new Date(),
    );
  }

  static restore(
    rideId: string,
    passengerId: string,
    driverId: string,
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
      driverId,
      new Segment(new Coord(fromLat, fromLong), new Coord(toLat, toLong)),
      status,
      date,
    );
  }

  accept(driverId: string) {
    if (this.status !== "requested") throw new Error("Invalid status!");
    this.driverId = driverId;
    this.status = "accepted";
  }

  start() {
    if (this.status !== "accepted") throw new Error("Invalid status!");
    this.status = "in_progress";
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

  getStatus() {
    return this.status;
  }
}
