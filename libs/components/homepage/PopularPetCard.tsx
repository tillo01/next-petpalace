import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Pet } from '../../types/pet/pet';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL, topPetRank } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface PopularPetCardProps {
	pet: Pet;
}

const PopularPetCard = (props: PopularPetCardProps) => {
	const { pet } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const pushDetailHandler = async (petId: string) => {
		console.log('ID', petId);
		await router.push({ pathname: '/pet/detail', query: { id: petId } });
	};

	if (device === 'mobile') {
		return (
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${pet?.petImages[0]})` }}
				>
					{pet?.petRank && pet?.petRank >= topPetRank ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					) : (
						''
					)}

					<div className={'price'}>${pet.petPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{pet.petTitle}</strong>
					<p className={'desc'}>{pet.petAddress}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{pet?.petHeight} weight</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{pet?.petAges} height</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{pet?.petWeight} age</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>{pet?.petAdoption ? 'rent' : 'sale'}</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{pet?.petViews}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="popular-card-box">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${pet?.petImages[0]})` }}
					onClick={() => {
						pushDetailHandler(pet._id);
					}}
				>
					{pet?.petRank && pet?.petRank >= topPetRank ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					) : (
						''
					)}
				</Box>
				<Box component={'div'} className={'info'}>
					<strong
						onClick={() => {
							pushDetailHandler(pet._id);
						}}
						className={'title'}
					>
						{pet.petTitle}
					</strong>
					<p className={'desc'}>{pet.petAddress}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/weight.png" alt="" />
							<span>{pet?.petHeight} weight</span>
						</div>
						<div>
							<img src="/img/icons/height.png" alt="" />
							<span>{pet?.petAges} height</span>
						</div>
						<div>
							<img src="/img/icons/age.png" alt="" />
							<span>{pet?.petWeight} ages</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>{pet?.petAdoption ? 'Adoption' : 'Sell'}</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{pet?.petViews}</Typography>
						</div>
					</div>
					<div className={'price'}>${pet.petPrice}</div>
				</Box>
			</Stack>
		);
	}
};

export default PopularPetCard;
