import React from 'react';
import { useRouter } from 'next/router';
import { Box, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface TopAgentProps {
	agent: Member;
}
const TopAgentCard = (props: TopAgentProps) => {
	const { agent } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const agentImage = agent?.memberImage
		? `${process.env.REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';
	const user = useReactiveVar(userVar);

	/** HANDLERS **/

	if (device === 'mobile') {
		return (
			<Stack className="top-agent-card">
				<img src={agentImage} alt="" />

				<strong>{agent?.memberNick}</strong>
				<span>{agent?.memberType}</span>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-agent-card">
				<Box>
					<img src={agentImage} alt="" />
				</Box>
				<Stack flexDirection="column" alignItems="center" justifyContent="flex-start" gap="10px" paddingLeft="10px">
					<Box className="top-seller-name">
						<strong>{agent?.memberNick}</strong>
						<span>{agent?.memberType}</span>
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
								<Typography>{agent?.memberLikes ? agent.memberLikes : '0'}</Typography>
							</div>
							<div>
								<Typography>{agent?.memberProperties ? agent.memberProperties : '0'}</Typography>
							</div>
						</Box>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default TopAgentCard;
