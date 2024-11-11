import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { PetsInquiry } from '../../types/pet/pet.input';
import { Pet } from '../../types/pet/pet';
import { GET_PETS } from '../../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Message } from '../../enums/common.enum';
import { LIKE_TARGET_PET } from '../../../apollo/user/mutation';
import TopPetCard from './TopPetCard';

interface TopPetsProps {
	initialInput: PetsInquiry;
}

const TopPets = (props: TopPetsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [topPets, setTopPets] = useState<Pet[]>([]);

	const [likeTargetPet] = useMutation(LIKE_TARGET_PET);

	/** APOLLO REQUESTS **/
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
			setTopPets(data?.getPets?.list);
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

	if (device === 'mobile') {
		return (
			<Stack className={'top-pets'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Top pets</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'top-pet-swiper'}
							slidesPerView={1}
							loop={true}
							centeredSlides={true}
							spaceBetween={15}
							modules={[Autoplay]}
						>
							{topPets.map((pet: Pet) => {
								return (
									<SwiperSlide className={'top-pet-slide'} key={pet?._id}>
										<TopPetCard pet={pet} likePetHandler={likePetHandler} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'top-pets'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Our Besties</span>
							<p>Check one more time</p>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Box component={'div'} className={'switch-btn swiper-top-prev'}>
							<ArrowBackIosNewIcon />
						</Box>
						<Swiper
							className={'top-pet-swiper'}
							slidesPerView={'auto'}
							spaceBetween={1}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-top-next',
								prevEl: '.swiper-top-prev',
							}}
						>
							{topPets.map((pet: Pet) => {
								return (
									<SwiperSlide className={'top-pet-slide'} key={pet?._id}>
										<TopPetCard pet={pet} likePetHandler={likePetHandler} />
									</SwiperSlide>
								);
							})}
						</Swiper>
						<Box component={'div'} className={'switch-btn swiper-top-next'}>
							<ArrowBackIosNewIcon />
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TopPets.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default TopPets;
