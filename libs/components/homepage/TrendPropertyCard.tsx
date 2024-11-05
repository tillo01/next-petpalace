import React, { useState } from 'react';
import { Stack, Box, Divider, Typography, Avatar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Property } from '../../types/property/property';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import { useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { GET_MEMBER } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { Member } from '../../types/member/member';
import { sweetErrorHandling } from '../../sweetAlert';
import ScaleIcon from '@mui/icons-material/Scale';
import HeightIcon from '@mui/icons-material/Height';
import Filter4Icon from '@mui/icons-material/Filter4';

interface TrendPropertyCardProps {
	property: Property;
	likePropertyHandler: any;
}

const TrendPropertyCard = (props: TrendPropertyCardProps) => {
	const { property, likePropertyHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [agentId, setAgentId] = useState<string | null>(null);
	const [agent, setAgent] = useState<Member | null>(null);

	/** HANDLERS **/
	const pushDetailHandler = async (propertyId: string) => {
		console.log('ID', propertyId);
		await router.push({ pathname: '/property/detail', query: { id: propertyId } });
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
			<Stack className="trend-card-box" key={property._id}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})` }}
					onClick={() => {
						pushDetailHandler(property._id);
					}}
				>
					<div>${property.propertyPrice}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong
						onClick={() => {
							pushDetailHandler(property._id);
						}}
						className={'title'}
					>
						{property.propertyTitle}
					</strong>
					<p className={'desc'}>{property.propertyDesc ?? 'no description'}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{property.propertyBeds} bed</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{property.propertyRooms} rooms</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{property.propertySquare} m2</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>
							{property.propertyRent ? 'Rent' : ''} {property.propertyRent && property.propertyBarter && '/'}{' '}
							{property.propertyBarter ? 'Barter' : ''}
						</p>
						<div className="view-like-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{property?.propertyViews}</Typography>
							<IconButton color={'default'} onClick={() => likePropertyHandler(user, property?._id)}>
								{property?.meLiked && property?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{property?.propertyLikes}</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="trend-card-box" key={property._id}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})` }}
					onClick={() => {
						pushDetailHandler(property._id);
					}}
				></Box>
				<Stack className="name-price">
					<strong className={'title'}>{property.propertyTitle}</strong>
					<Box className="like-btn">
						<IconButton color={'default'} onClick={() => likePropertyHandler(user, property?._id)}>
							{property?.meLiked && property?.meLiked[0]?.myFavorite ? (
								<FavoriteIcon style={{ color: 'red' }} />
							) : (
								<FavoriteIcon />
							)}
						</IconButton>
						<Typography className="view-cnt">{property?.propertyLikes}</Typography>
						<IconButton color={'default'}>
							<RemoveRedEyeIcon />
						</IconButton>
						<Typography className="view-cnt">{property?.propertyViews}</Typography>
					</Box>
				</Stack>
				<Box component={'div'} className={'info'}>
					<p className={'desc'}>{property.propertyDesc ?? 'no description'}</p>

					<div className={'options'}>
						<div>
							<img src="/img/icons/weight.png" alt="" />
							<span>{property.propertyBeds} weight</span>
						</div>
						<div>
							<img src="/img/icons/height.png" alt="" />
							<span>{property.propertyRooms} height</span>
						</div>
						<div>
							<img src="/img/icons/age.png" alt="" />
							<span>{property.propertySquare} age</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<p>
							<Avatar
								className="little-member"
								onClick={() => redirectToMemberPageHandler(property?.memberData?._id as string)}
								src={
									property?.memberData?.memberImage
										? `${process.env.REACT_APP_API_URL}/${property?.memberData.memberImage}`
										: '/img/profile/defaultUser.svg'
								}
								sx={{ width: 48, height: 48, marginRight: 2 }}
							/>
							<p>{property?.memberData?.memberNick ?? 'Agent'}</p>
						</p>
						<p>
							{property.propertyRent ? 'Rent' : ''} {property.propertyRent && property.propertyBarter && '/'}{' '}
							{property.propertyBarter ? 'Barter' : ''}
						</p>

						<div className="view-like-box">
							<Typography className="property-price">
								<div>${property.propertyPrice}</div>
							</Typography>
						</div>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default TrendPropertyCard;
