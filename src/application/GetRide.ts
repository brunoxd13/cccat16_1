import { AccountRepository } from "../resource/AccountRepository";
import RideRepository from "../resource/RideRepository";

export default class GetRide {
  constructor(readonly accountRepository: AccountRepository, readonly rideRepository: RideRepository){}

  async execute(input: Input): Promise<Output> {
    const ride = await this.rideRepository.getRideById(input.rideId);
    const passanger = await this.accountRepository.getAccountById(ride.passengerId);

    return {
      rideId: ride.rideId,
      passengerId: ride.passengerId,
      fromLat: ride.fromLat,
      fromLong: ride.fromLong,
      toLat: ride.toLat,
      toLong: ride.toLong,
      status: ride.status,
      passangerName: passanger.name,
      passangerEmail: passanger.email
    }

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
  passangerName: string;
  passangerEmail: string;
}