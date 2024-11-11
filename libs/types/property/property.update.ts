import { PetLocation, PetStatus, PetType } from '../../enums/property.enum';

export interface PropertyUpdate {
	_id: string;
	propertyType?: PetType;
	propertyStatus?: PetStatus;
	propertyLocation?: PetLocation;
	propertyAddress?: string;
	propertyTitle?: string;
	propertyPrice?: number;
	propertySquare?: number;
	propertyBeds?: number;
	propertyRooms?: number;
	propertyImages?: string[];
	propertyDesc?: string;
	propertyBarter?: boolean;
	propertyRent?: boolean;
	soldAt?: Date;
	deletedAt?: Date;
	constructedAt?: Date;
}
