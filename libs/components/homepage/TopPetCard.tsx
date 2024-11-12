import React from 'react';
import { Stack, Box, Divider, Typography, Avatar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Pet } from '../../types/pet/pet';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { sweetErrorHandling } from '../../sweetAlert';

interface TopPetCardProps {
	pet: Pet;
	likePetHandler: any;
}

const TopPetCard = (props: TopPetCardProps) => {
	const { pet, likePetHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const pushDetailHandler = async (petId: string) => {
		console.log('ID', petId);
		await router.push({ pathname: '/pet/detail', query: { id: petId } });
	};
	const redirectToMemberPageHandler = async (memberId: string) => {
		try {
			if (memberId === user?._id) await router.push(`/mypage?memberId=${memberId}`);
			else await router.push(`/member?memberId=${memberId}`);
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};

	if (device === 'mobile') {
		return (
			<Stack className="top-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${pet?.petImages[0]})` }}
				>
					<div>${pet?.petPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{pet?.petTitle}</strong>
					<p className={'desc'}>{pet?.petAddress}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/age.svg" alt="" />
							<span>{pet?.petHeight} age</span>
						</div>
						<div>
							<img src="/img/icons/height.svg" alt="" />
							<span>{pet?.petAges} heights</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{pet?.petWeight} m2</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>
							{' '}
							{pet.petAdoption ? 'Adoption' : ''} {pet.petAdoption && pet.petSell && '/'} {pet.petSell ? 'Sell' : ''}
						</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{pet?.petViews}</Typography>
							<IconButton color={'default'} onClick={() => likePetHandler(user, pet?._id)}>
								{pet?.meLiked && pet?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{pet?.petLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${pet?.petImages[0]})` }}
					onClick={() => {
						pushDetailHandler(pet._id);
					}}
				>
					<div>${pet?.petPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong
						onClick={() => {
							pushDetailHandler(pet._id);
						}}
						className={'title'}
					>
						{pet?.petTitle}
					</strong>
					<p className={'desc'}>{pet?.petAddress}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/weight.png" alt="" />

							<span>{pet?.petHeight} age</span>
						</div>
						<div>
							<img src="/img/icons/height.png" alt="" />

							<span>{pet?.petAges} heights</span>
						</div>
						<div>
							<img src="/img/icons/age.png" alt="" />
							<span>{pet?.petWeight} m2</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>
							{' '}
							{pet.petAdoption ? 'Adoption' : ''} {pet.petAdoption && pet.petSell && '/'} {pet.petSell ? 'Sell' : ''}
						</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{pet?.petViews}</Typography>
							<IconButton color={'default'} onClick={() => likePetHandler(user, pet?._id)}>
								{pet?.meLiked && pet?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{pet?.petLikes}</Typography>
						</div>
					</div>
					<div className="seller-nick">
						<p>
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

						<p>{pet?.memberData?.memberNick ?? 'Agent'}</p>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default TopPetCard;
