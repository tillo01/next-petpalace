import React from 'react';
import { Stack, Typography, Box, Avatar } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Pet } from '../../types/pet/pet';
import Link from 'next/link';
import { formatterStr } from '../../utils';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { sweetErrorHandling } from '../../sweetAlert';
import router from 'next/router';

interface PetCardType {
	pet: Pet;
	likePetHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const PetCard = (props: PetCardType) => {
	const { pet, likePetHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = pet?.petImages[0] ? `${REACT_APP_API_URL}/${pet?.petImages[0]}` : '/img/banner/header1.svg';

	const redirectToMemberPageHandler = async (memberId: string) => {
		try {
			if (memberId === user?._id) await router.push(`/mypage?memberId=${memberId}`);
			else await router.push(`/member?memberId=${memberId}`);
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};
	if (device === 'mobile') {
		return <div>PET CARD</div>;
	} else {
		return (
			<Stack className="card-config">
				<Stack className="top">
					<Link
						href={{
							pathname: '/pet/detail',
							query: { id: pet?._id },
						}}
					>
						<img src={imagePath} alt="" />
					</Link>
					{pet && pet?.petRank > 0 && (
						<Box component={'div'} className={'top-badge'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<Typography>TOP</Typography>
						</Box>
					)}
					<Box component={'div'} className={'price-box'}>
						<Typography>${formatterStr(pet?.petPrice)}</Typography>
					</Box>
					<div className="seller-nick">
						<p style={{ cursor: 'pointer' }}>
							<Avatar
								className="little-member"
								onClick={() => redirectToMemberPageHandler(pet?.memberData?._id as string)}
								src={
									pet?.memberData?.memberImage
										? `${process.env.REACT_APP_API_URL}/${pet?.memberData.memberImage}`
										: '/img/profile/defaultUser.svg'
								}
								sx={{ width: 48, height: 48, marginRight: 2 }}
							/>
						</p>

						<p>{pet?.memberData?.memberNick ?? 'Seller'}</p>
					</div>
				</Stack>
				<Stack className="bottom">
					<Stack className="name-address">
						<Stack className="name">
							<Link
								href={{
									pathname: '/pet/detail',
									query: { id: pet?._id },
								}}
							>
								<Typography>{pet.petTitle}</Typography>
							</Link>
						</Stack>
						<Stack className="address">
							<Typography>
								{pet.petAddress}, {pet.petLocation}
							</Typography>
						</Stack>
					</Stack>
					<Stack className="options">
						<Stack className="option">
							<img src="/img/icons/weight.png" alt="" />
							<Typography>{pet.petHeight} age</Typography>
						</Stack>
						<Stack className="option">
							<img src="/img/icons/height.png" alt="" />
							<Typography>{pet.petAges} height</Typography>
						</Stack>
						<Stack className="option">
							<img src="/img/icons/age.png" alt="" />
							<Typography>{pet.petWeight}kg</Typography>
						</Stack>
					</Stack>
					<Stack className="divider"></Stack>
					<Stack className="type-buttons">
						<Stack className="type">
							<Typography sx={{ fontWeight: 500, fontSize: '13px' }} className={pet.petAdoption ? '' : 'disabled-type'}>
								Adoption
							</Typography>
							<Typography sx={{ fontWeight: 500, fontSize: '13px' }} className={pet.petSell ? '' : 'disabled-type'}>
								Sell
							</Typography>
						</Stack>
						{!recentlyVisited && (
							<Stack className="buttons">
								<IconButton color={'default'}>
									<RemoveRedEyeIcon />
								</IconButton>
								<Typography className="view-cnt">{pet?.petViews}</Typography>
								<IconButton color={'default'} onClick={() => likePetHandler(user, pet?._id)}>
									{myFavorites ? (
										<FavoriteIcon color="primary" />
									) : pet?.meLiked && pet?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon color="primary" />
									) : (
										<FavoriteBorderIcon />
									)}
								</IconButton>
								<Typography className="view-cnt">{pet?.petLikes}</Typography>
							</Stack>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default PetCard;
