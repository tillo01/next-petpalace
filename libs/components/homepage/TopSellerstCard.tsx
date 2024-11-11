import React from 'react';
import { useRouter } from 'next/router';
import { Box, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface TopAgentProps {
	seller: Member;
}
const TopAgentCard = (props: TopAgentProps) => {
	const { seller } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const sellerImage = seller?.memberImage
		? `${process.env.REACT_APP_API_URL}/${seller?.memberImage}`
		: '/img/profile/defaultUser.svg';
	const user = useReactiveVar(userVar);

	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className="top-seller-card">
				<img src={sellerImage} alt="" />

				<strong>{seller?.memberNick}</strong>
				<span>{seller?.memberType}</span>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-seller-card">
				<Box>
					<img src={sellerImage} alt="" />
				</Box>
				<Stack flexDirection="column" alignItems="center" justifyContent="flex-start" gap="10px" paddingLeft="10px">
					<Box className="top-seller-name">
						<strong>{seller?.memberNick}</strong>
						<span>{seller?.memberType}</span>
					</Box>

					<Box style={{ backgroundColor: 'gray', borderRadius: '20px' }}>
						<Box className="top-seller-info">
							<div>
								<Typography>Likes</Typography>
							</div>
							<div>
								<Typography>Pets</Typography>
							</div>
						</Box>
						<Box className="top-seller-graph">
							<div>
								<Typography>{seller?.memberLikes ? seller.memberLikes : '0'}</Typography>
							</div>
							<div>
								<Typography>{seller?.memberPets ? seller.memberPets : '0'}</Typography>
							</div>
						</Box>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default TopAgentCard;
