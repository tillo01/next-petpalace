import { PetLocation, PetStatus, PetType } from '../../enums/pet.enum';

export interface PetUpdate {
	_id: string;
	petType?: PetType;
	petStatus?: PetStatus;
	petLocation?: PetLocation;
	petAddress?: string;
	petTitle?: string;
	petPrice?: number;
	petWeight?: number;
	petHeight?: number;
	petAges?: number;
	petImages?: string[];
	petDesc?: string;
	petSell?: boolean;
	petAdoption?: boolean;
	soldAt?: Date;
	deletedAt?: Date;
	bornAt?: Date;
}
