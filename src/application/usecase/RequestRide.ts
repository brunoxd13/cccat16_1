import { AccountRepository } from "../../infrastructure/repository/AccountRepository";
import crypto from "crypto";
import RideDAO from "../../infrastructure/repository/RideRepository";
import Ride from "../domain/Ride";

export class GetAccount {
  constructor(readonly accountRepository: AccountRepository, readonly rideDAO: RideDAO) {}

  async execute(input: Input): Promise<Output> {
    const account = await this.accountRepository.getAccountById(input.passengerId);
    if (!account.isPassenger) throw new Error("Account is not a passanger");

    const hasActiveRide = await this.rideDAO.hasActiveRideByPassangerId(
      input.passengerId
    );
    if (hasActiveRide) throw new Error("Passanger has an active ride");

    const ride = Ride.create(
      input.passengerId,
      input.fromLat,
      input.fromLong,
      input.toLat,
      input.toLong
    );

    const rideId = await this.rideDAO.saveRide(ride);

    return {
      rideId: rideId,
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
