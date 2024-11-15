import { PetLocation, PetStatus, PetType } from '../../enums/pet.enum';
import { Direction } from '../../enums/common.enum';

export interface PetInput {
	petType: PetType;
	petLocation: PetLocation;
	petAddress: string;
	petTitle: string;
	petPrice: number;
	petWeight: number;
	petHeight: number;
	petAges: number;
	petImages: string[];
	petDesc?: string;
	petSell?: boolean;
	petAdoption?: boolean;
	memberId?: string;
	bornAt?: Date;
}

interface PISearch {
	memberId?: string;
	locationList?: PetLocation[];
	typeList?: PetType[];
	agesList?: Number[];
	options?: string[];
	heightsList?: Number[];
	pricesRange?: Range;
	periodsRange?: PeriodsRange;
	weightRange?: Range;
	text?: string;
}

export interface PetsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

interface APISearch {
	petStatus?: PetStatus;
}

export interface SellerPetsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: APISearch;
}

interface ALPISearch {
	petStatus?: PetStatus;
	petLocationList?: PetLocation[];
}

export interface AllPetsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALPISearch;
}

interface Range {
	start: number;
	end: number;
}

interface PeriodsRange {
	start: Date | number;
	end: Date | number;
}
