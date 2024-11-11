import { PetLocation, PetStatus, PetType } from '../../enums/pet.enum';
import { Member } from '../member/member';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Pet {
	_id: string;
	petType: PetType;
	petStatus: PetStatus;
	petLocation: PetLocation;
	petAddress: string;
	petTitle: string;
	petPrice: number;
	petWeight: number;
	petHeight: number;
	petAges: number;
	petViews: number;
	petLikes: number;
	petComments: number;
	petRank: number;
	petImages: string[];
	petDesc?: string;
	petSell: boolean;
	petAdoption: boolean;
	memberId: string;
	soldAt?: Date;
	deletedAt?: Date;
	bornAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Pets {
	list: Pet[];
	metaCounter: TotalCounter[];
}
