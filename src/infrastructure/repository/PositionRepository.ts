// interface adapter

import pgp from "pg-promise";
import Position from "../../domain/entity/Position";
import DatabaseConnection from "../database/DatabaseConnection";

export default interface PositionRepository {
  savePosition(position: Position): Promise<void>;
}

export class PositionRepositoryDatabase implements PositionRepository {
  constructor(readonly databaseConnection: DatabaseConnection) {}

  async savePosition(position: Position): Promise<void> {
    await this.databaseConnection.query(
      "insert into cccat16.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)",
      [
        position.positionId,
        position.rideId,
        position.coord.getLat(),
        position.coord.getLong(),
        position.date,
      ],
    );
  }
}
