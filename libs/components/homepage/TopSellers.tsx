import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import TopSellerCard from './TopSellerstCard';
import { Member } from '../../types/member/member';
import { SellersInquiry } from '../../types/member/member.input';
import { GET_SELLERS } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';

interface TopSellersProps {
	initialInput: SellersInquiry;
}

const TopSellers = (props: TopSellersProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [topSellers, setTopSellers] = useState<Member[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getSellersLoading,
		data: getSellersData,
		error: getSellersError,
		refetch: getSellersRefetch,
	} = useQuery(GET_SELLERS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTopSellers(data?.getSellers?.list);
		},
	});
	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className={'top-sellers'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>Our Sellers</span>
					</Stack>
					<Stack className={'wrapper'}>
						<Swiper
							className={'top-sellers-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={29}
							modules={[Autoplay]}
						>
							{topSellers.map((seller: Member) => {
								return (
									<SwiperSlide className={'top-sellers-slide'} key={seller?._id}>
										<TopSellerCard seller={seller} key={seller?.memberNick} />
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
			<Stack className={'top-sellers'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Our Sellers</span>
							<p>The owner of our cutiests</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<span>Check all Sellers</span>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>
					<Stack className={'wrapper'}>
						<Box component={'div'} className={'switch-btn swiper-sellers-prev'}>
							<ArrowBackIosNewIcon />
						</Box>
						<Box component={'div'} className={'card-wrapper'}>
							<Swiper
								className={'top-sellers-swiper'}
								slidesPerView={'auto'}
								spaceBetween={29}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{
									nextEl: '.swiper-sellers-next',
									prevEl: '.swiper-sellers-prev',
								}}
							>
								{topSellers.map((seller: Member) => {
									return (
										<SwiperSlide className={'top-sellers-slide'} key={seller?._id}>
											<TopSellerCard seller={seller} key={seller?.memberNick} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						</Box>
						<Box component={'div'} className={'switch-btn swiper-sellers-next'}>
							<ArrowBackIosNewIcon />
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TopSellers.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'memberRank',
		direction: 'DESC',
		search: {},
	},
};

export default TopSellers;
