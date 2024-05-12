import Ride from "../../domain/Ride";
import DatabaseConnection from "../database/DatabaseConnection";

export default interface RideRepository {
  saveRide(ride: Ride): Promise<void>;
  getRideById(rideId: string): Promise<Ride>;
  hasActiveRideByPassengerId(passangerId: string): Promise<boolean>;
  updateRide (ride: Ride): Promise<void>;
}

export class RideRepositoryDatabase implements RideRepository {
  constructor(readonly databaseConnection: DatabaseConnection) {}

  async saveRide(ride: Ride): Promise<void> {
    const { rideId, passengerId, date } = ride;
    await this.databaseConnection.query(
      "insert into cccat16.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [rideId, passengerId, ride.getFromLat(), ride.getFromLong(), ride.getToLat(), ride.getToLong(), ride.getStatus(), date]
    );
  }

  async getRideById(rideId: string): Promise<Ride> {
    const [rideData] = await this.databaseConnection.query(
      "select * from cccat16.ride where ride_id = $1",
      [rideId]
    );
    return Ride.restore(
      rideData.ride_id,
      rideData.passenger_id,
      rideData.driver_id,
      parseFloat(rideData.from_lat),
      parseFloat(rideData.from_long),
      parseFloat(rideData.to_lat),
      parseFloat(rideData.to_long),
      rideData.status,
      rideData.date
    );
  }

  async hasActiveRideByPassengerId(passangerId: string): Promise<boolean> {
    const [rideData] = await this.databaseConnection.query(
      "select * from cccat16.ride where passenger_id  = $1 and status <> 'completed'",
      [passangerId]
    );
    return !!rideData;
  }

  async updateRide(ride: Ride): Promise<void> {
		await this.databaseConnection.query("update cccat16.ride set status = $1, driver_id = $2 where ride_id = $3", [ride.getStatus(), ride.driverId, ride.rideId]);
	}
}

