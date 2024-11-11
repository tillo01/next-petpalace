import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import PopularPetCard from './PopularPetCard';
import { Pet } from '../../types/pet/pet';
import Link from 'next/link';
import { PetsInquiry } from '../../types/pet/pet.input';
import { GET_PETS } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';

interface PopularPetsProps {
	initialInput: PetsInquiry;
}

const PopularPets = (props: PopularPetsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [popularPets, setPopularPets] = useState<Pet[]>([]);

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
			setPopularPets(data?.getPets?.list);
		},
	});
	/** HANDLERS **/

	if (!popularPets) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'popular-pets'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Popular pets</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-pet-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={25}
							modules={[Autoplay]}
						>
							{popularPets.map((pet: Pet) => {
								return (
									<SwiperSlide key={pet._id} className={'popular-pet-slide'}>
										<PopularPetCard pet={pet} />
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
			<Stack className={'popular-pets'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Our Cutiest Collection</span>
							<p>Based on being most cutiest</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<Link href={'/pet'}>
									<span>All one </span>
								</Link>
								<img src="/img/icons/grid.png" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{popularPets.map((pet: Pet) => {
							return (
								<Stack key={pet._id} className={'popular-pet-slide'}>
									<PopularPetCard pet={pet} />
								</Stack>
							);
						})}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

PopularPets.defaultProps = {
	initialInput: {
		page: 1,
		limit: 3,
		sort: 'petViews',
		direction: 'DESC',
		search: {},
	},
};

export default PopularPets;
