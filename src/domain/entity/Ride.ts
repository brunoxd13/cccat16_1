import crypto from "crypto";
import Coord from "../vo/Coord";
import RideStatus, { RideStatusFactory } from "../vo/RideStatus";
import Segment from "../vo/Segment";

export default class Ride {
  status: RideStatus;

  private constructor(
    readonly rideId: string,
    readonly passengerId: string,
    public driverId: string,
    private segment: Segment,
    status: string,
    readonly date: Date,
  ) {
    this.status = RideStatusFactory.create(this, status);
  }

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
    this.status.accept();
    this.driverId = driverId;
  }

  start() {
    this.status.start();
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
    return this.status.value;
  }
}
