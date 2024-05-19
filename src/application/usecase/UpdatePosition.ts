import Position from "../../domain/entity/Position";
import PositionRepository from "../../infrastructure/repository/PositionRepository";
import RideRepository from "../../infrastructure/repository/RideRepository";

export default class UpdatePosition {
  constructor(
    readonly rideRepository: RideRepository,
    readonly positionRepository: PositionRepository,
  ) {}

  async execute(input: Input): Promise<void> {
    const ride = await this.rideRepository.getRideById(input.rideId);
    ride.updatePosition(input.lat, input.long);
    await this.rideRepository.saveRide(ride);
    const position = Position.create(input.rideId, input.lat, input.long);
    await this.positionRepository.savePosition(position);
  }
}

type Input = {
  rideId: string;
  lat: number;
  long: number;
};