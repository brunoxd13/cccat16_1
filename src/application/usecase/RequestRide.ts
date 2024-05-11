import { AccountRepository } from "../../infrastructure/repository/AccountRepository";
import RideDAO from "../../infrastructure/repository/RideRepository";
import Ride from "../../domain/Ride";

export default class RequestRide {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly rideDAO: RideDAO,
  ) {}

  async execute(input: Input): Promise<Output> {
    const account = await this.accountRepository.getAccountById(
      input.passengerId,
    );

    if (!account.isPassenger) throw new Error("Account is not from a passenger");

    const hasActiveRide = await this.rideDAO.hasActiveRideByPassengerId(
      input.passengerId,
    );

    if (hasActiveRide) {
      throw new Error("Passenger has an active ride");
    }

    const ride = Ride.create(
      input.passengerId,
      input.fromLat,
      input.fromLong,
      input.toLat,
      input.toLong,
    );

    await this.rideDAO.saveRide(ride);

    return {
      rideId: ride.rideId,
    };
  }
}

type Input = {
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
};

type Output = {
  rideId: string;
};
