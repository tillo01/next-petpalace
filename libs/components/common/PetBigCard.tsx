import React from 'react';
import { Stack, Box, Divider, Typography, Avatar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Pet } from '../../types/pet/pet';
import { REACT_APP_API_URL, topPetRank } from '../../config';
import { formatterStr } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { T } from '../../types/common';
import { sweetErrorHandling } from '../../sweetAlert';

interface PetBigCardProps {
	pet: Pet;
	likePetHandler?: any;
}

const PetBigCard = (props: PetBigCardProps) => {
	const { pet, likePetHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** HANDLERS **/
	const goPetDetatilPage = (petId: string) => {
		router.push(`/pet/detail?id=${petId}`);
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
		return <div>PET BIG CARD</div>;
	} else {
		return (
			<Stack className="pet-big-card-box" onClick={() => goPetDetatilPage(pet?._id)}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${pet?.petImages?.[0]})` }}
				>
					{pet?.petRank && pet?.petRank >= topPetRank ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					) : (
						''
					)}

					<div className={'price'}>${formatterStr(pet?.petPrice)}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{pet?.petTitle}</strong>
					<p className={'desc'}>{pet?.petAddress}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/weight.png" alt="" />
							<span>{pet?.petHeight} kg</span>
						</div>
						<div>
							<img src="/img/icons/height.png" alt="" />
							<span>{pet?.petAges} cm</span>
						</div>
						<div>
							<img src="/img/icons/age.png" alt="" />
							<span>{pet?.petWeight} ages</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div>
							{pet?.petAdoption ? <p>Adoption</p> : <span>Adoption</span>}
							{pet?.petSell ? <p>Sell</p> : <span>Sell</span>}
						</div>
						<div className="buttons-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{pet?.petViews}</Typography>
							<IconButton
								color={'default'}
								onClick={(e: T) => {
									e.stopPropagation();
									likePetHandler(user, pet?._id);
								}}
							>
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

						<p>{pet?.memberData?.memberNick ?? 'Sller'}</p>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default PetBigCard;
