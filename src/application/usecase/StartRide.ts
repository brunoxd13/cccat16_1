// use case
import RideRepository from "../../infrastructure/repository/RideRepository";

export default class StartRide {
	constructor (readonly rideRepository: RideRepository) {}
	
	async execute (input: Input): Promise<void> {
		const ride = await this.rideRepository.getRideById(input.rideId);
		ride.start();
		await this.rideRepository.updateRide(ride);
	}
}

type Input = {
	rideId: string
}
