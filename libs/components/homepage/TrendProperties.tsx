import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Pet } from '../../types/pet/pet';
import { PetsInquiry } from '../../types/pet/pet.input';
import TrendPetCard from './TrendPetCard';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PETS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { LIKE_TARGET_PET } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import { Messages } from '../../config';

interface TrendPetsProps {
	initialInput: PetsInquiry;
}

const TrendPets = (props: TrendPetsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [trendPets, setTrendPets] = useState<Pet[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetPet] = useMutation(LIKE_TARGET_PET);

	const {
		loading: getPetsLoading,
		data: getPetsData,
		error: getPetsError,
		refetch: getPetsRefetch,
	} = useQuery(GET_PETS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTrendPets(data?.getPets?.list);
		},
	});

	/** HANDLERS **/
	const likePetHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetPet({ variables: { input: id } });

			await getPetsRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('Erron on likePetHandler', err);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (trendPets) console.log('trendPets:+++', trendPets);
	if (!trendPets) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'trend-pets'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Most Animals</span>
					</Stack>
					<Stack className={'card-box'}>
						{trendPets.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							<Swiper
								className={'trend-pet-swiper'}
								slidesPerView={'auto'}
								centeredSlides={true}
								spaceBetween={15}
								modules={[Autoplay]}
							>
								{trendPets.map((pet: Pet) => {
									return (
										<SwiperSlide key={pet._id} className={'trend-pet-slide'}>
											<TrendPetCard pet={pet} likePetHandler={likePetHandler} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'trend-pets'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Fan-Favorite Pets</span>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon className={'swiper-trend-prev'} />
								<div className={'swiper-trend-pagination'}></div>
								<EastIcon className={'swiper-trend-next'} />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{trendPets.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								Trends Empty
							</Box>
						) : (
							<Swiper
								className={'trend-pet-swiper'}
								slidesPerView={'auto'}
								spaceBetween={15}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-trend-next',
									prevEl: '.swiper-trend-prev',
								}}
								pagination={{
									el: '.swiper-trend-pagination',
								}}
							>
								{trendPets.map((pet: Pet) => {
									return (
										<SwiperSlide key={pet._id} className={'trend-pet-slide'}>
											<TrendPetCard pet={pet} likePetHandler={likePetHandler} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TrendPets.defaultProps = {
	initialInput: {
		page: 1,
		limit: 20,
		sort: 'petLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TrendPets;
