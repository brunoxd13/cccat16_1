import { AccountRepository } from "../../infrastructure/repository/AccountRepository";
import RideRepository from "../../infrastructure/repository/RideRepository";

export default class GetRide {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly rideRepository: RideRepository,
  ) {}

  async execute(input: Input): Promise<Output> {
    const ride = await this.rideRepository.getRideById(input.rideId);
    const passanger = await this.accountRepository.getAccountById(
      ride.passengerId,
    );
    let driver;
    if (ride.driverId) {
      driver = await this.accountRepository.getAccountById(ride.driverId);
    }

    return {
      rideId: ride.rideId,
      passengerId: ride.passengerId,
      fromLat: ride.getFromLat(),
      fromLong: ride.getFromLong(),
      toLat: ride.getToLat(),
      toLong: ride.getToLong(),
      status: ride.getStatus(),
      passengerName: passanger?.getName(),
      passengerEmail: passanger?.getEmail(),
      driverName: driver?.getName(),
      driverEmail: driver?.getEmail(),
    };
  }
}

type Input = {
  rideId: string;
};

type Output = {
  rideId: string;
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  status: string;
  passengerName: string;
  passengerEmail: string;
  driverName?: string;
  driverEmail?: string;
};
