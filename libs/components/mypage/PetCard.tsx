import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import IconButton from '@mui/material/IconButton';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';
import { Pet } from '../../types/pet/pet';
import { formatterStr } from '../../utils';
import Moment from 'react-moment';
import { useRouter } from 'next/router';
import { PetStatus } from '../../enums/pet.enum';

interface PetCardProps {
	pet: Pet;
	deletePetHandler?: any;
	memberPage?: boolean;
	updatePetHandler?: any;
	likePetHandler?: any;
}

export const PetCard = (props: PetCardProps) => {
	const { pet, deletePetHandler, memberPage, updatePetHandler, likePetHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	/** HANDLERS **/
	const pushEditPet = async (id: string) => {
		console.log('+pushEditPet: ', id);
		await router.push({
			pathname: '/mypage',
			query: { category: 'addPet', petId: id },
		});
	};

	const pushPetDetail = async (id: string) => {
		if (memberPage)
			await router.push({
				pathname: '/pet/detail',
				query: { id: id },
			});
		else return;
	};

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return <div>MOBILE PET CARD</div>;
	} else
		return (
			<Stack className="pet-card-box">
				<Stack className="image-box" onClick={() => pushPetDetail(pet?._id)}>
					<img src={`${process.env.REACT_APP_API_URL}/${pet.petImages[0]}`} alt="" />
				</Stack>
				<Stack className="information-box" onClick={() => pushPetDetail(pet?._id)}>
					<Typography className="name">{pet.petTitle}</Typography>
					<Typography className="address">{pet.petAddress}</Typography>
					<Typography className="price">
						<strong>${formatterStr(pet?.petPrice)}</strong>
					</Typography>
				</Stack>
				<Stack className="date-box">
					<Typography className="date">
						<Moment format="DD MMMM, YYYY">{pet.createdAt}</Moment>
					</Typography>
				</Stack>
				<Stack className="status-box">
					<Stack className="coloured-box" sx={{ background: '#E5F0FD' }} onClick={handleClick}>
						<Typography className="status" sx={{ color: '#3554d1' }}>
							{pet.petStatus}
						</Typography>
					</Stack>
				</Stack>
				{!memberPage && pet.petStatus !== 'SOLD' && (
					<Menu
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						PaperProps={{
							elevation: 0,
							sx: {
								width: '70px',
								mt: 1,
								ml: '10px',
								overflow: 'visible',
								filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							},
							style: {
								padding: 0,
								display: 'flex',
								justifyContent: 'center',
							},
						}}
					>
						{pet.petStatus === 'ACTIVE' && (
							<>
								<MenuItem
									disableRipple
									onClick={() => {
										handleClose();
										updatePetHandler(PetStatus.SOLD, pet?._id);
									}}
								>
									Sold
								</MenuItem>
							</>
						)}
					</Menu>
				)}

				<Stack className="views-box">
					<Typography className="views">{pet.petViews.toLocaleString()}</Typography>
				</Stack>
				{!memberPage && pet.petStatus === PetStatus.ACTIVE && (
					<Stack className="action-box">
						<IconButton className="icon-button" onClick={() => pushEditPet(pet._id)}>
							<ModeIcon style={{ color: '#7ed957' }} className="buttons" />
						</IconButton>
						<IconButton className="icon-button" onClick={() => deletePetHandler(pet._id)}>
							<DeleteIcon style={{ color: 'red' }} className="buttons" />
						</IconButton>
					</Stack>
				)}
			</Stack>
		);
};
