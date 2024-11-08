import React from 'react';
import { Stack, Box, Divider, Typography, Avatar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Property } from '../../types/property/property';
import { REACT_APP_API_URL, topPropertyRank } from '../../config';
import { formatterStr } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { T } from '../../types/common';
import { sweetErrorHandling } from '../../sweetAlert';

interface PropertyBigCardProps {
	property: Property;
	likePropertyHandler?: any;
}

const PropertyBigCard = (props: PropertyBigCardProps) => {
	const { property, likePropertyHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** HANDLERS **/
	const goPropertyDetatilPage = (propertyId: string) => {
		router.push(`/property/detail?id=${propertyId}`);
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
		return <div>APARTMEND BIG CARD</div>;
	} else {
		return (
			<Stack className="property-big-card-box" onClick={() => goPropertyDetatilPage(property?._id)}>
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages?.[0]})` }}
				>
					{property?.propertyRank && property?.propertyRank >= topPropertyRank ? (
						<div className={'status'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<span>top</span>
						</div>
					) : (
						''
					)}

					<div className={'price'}>${formatterStr(property?.propertyPrice)}</div>
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{property?.propertyTitle}</strong>
					<p className={'desc'}>{property?.propertyAddress}</p>
					<div className={'options'}>
						<div>
							<img src="/img/icons/bed.svg" alt="" />
							<span>{property?.propertyBeds} bed</span>
						</div>
						<div>
							<img src="/img/icons/room.svg" alt="" />
							<span>{property?.propertyRooms} rooms</span>
						</div>
						<div>
							<img src="/img/icons/expand.svg" alt="" />
							<span>{property?.propertySquare} m2</span>
						</div>
					</div>
					<Divider sx={{ mt: '15px', mb: '17px' }} />
					<div className={'bott'}>
						<div>
							{property?.propertyRent ? <p>Rent</p> : <span>Rent</span>}
							{property?.propertyBarter ? <p>Barter</p> : <span>Barter</span>}
						</div>
						<div className="buttons-box">
							<IconButton color={'default'}>
								<RemoveRedEyeIcon />
							</IconButton>
							<Typography className="view-cnt">{property?.propertyViews}</Typography>
							<IconButton
								color={'default'}
								onClick={(e: T) => {
									e.stopPropagation();
									likePropertyHandler(user, property?._id);
								}}
							>
								{property?.meLiked && property?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon style={{ color: 'red' }} />
								) : (
									<FavoriteIcon />
								)}
							</IconButton>
							<Typography className="view-cnt">{property?.propertyLikes}</Typography>
						</div>
					</div>
					<div className="seller-nick">
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
						</p>

						<p>{property?.memberData?.memberNick ?? 'Agent'}</p>
					</div>
				</Box>
			</Stack>
		);
	}
};

export default PropertyBigCard;
