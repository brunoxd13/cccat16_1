import crypto from "crypto";
import pgp from "pg-promise";
import Ride from "../../domain/Ride";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://postgres:123456@localhost:5432/app";

export default interface RideRepository {
  saveRide(ride: Ride): Promise<string>;
  getRideById(rideId: string): Promise<Ride>;
  hasActiveRideByPassangerId(passangerId: string): Promise<boolean>;
}

export class RideRideRepositoryDatabase implements RideRepository {
  async saveRide(ride: Ride): Promise<string> {
    const connection = pgp()(DATABASE_URL);
    try {
      const { passengerId, fromLat, fromLong, toLat, toLong, status, date } =
        ride;
      const id = crypto.randomUUID();
      await connection.query(
        "insert into cccat16.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)",
        [id, passengerId, fromLat, fromLong, toLat, toLong, status, date]
      );
      return id;
    } finally {
      await connection.$pool.end();
    }
  }

  async getRideById(rideId: string): Promise<Ride> {
    const connection = pgp()(DATABASE_URL);
    const [rideData] = await connection.query(
      "select * from cccat16.ride where ride_id = $1",
      [rideId]
    );
    await connection.$pool.end();
    return Ride.restore(
      rideData.ride_id,
      rideData.passenger_id,
      parseFloat(rideData.from_lat),
      parseFloat(rideData.from_long),
      parseFloat(rideData.to_lat),
      parseFloat(rideData.to_long),
      rideData.status,
      rideData.date
    );
  }

  async hasActiveRideByPassangerId(passangerId: string): Promise<boolean> {
    const connection = pgp()(DATABASE_URL);
    const [rideData] = await connection.query(
      "select * from cccat16.ride where passenger_id  = $1 and status <> 'completed'",
      [passangerId]
    );
    await connection.$pool.end();
    return !!rideData;
  }
}
