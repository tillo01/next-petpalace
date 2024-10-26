/** @format */

import React, { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useQuery } from '@apollo/client';
import { T } from '../types/common';
import { Noitfies, NotifInquiry, NotifMe } from '../types/notigication.ts/notif';
import { Direction } from '../enums/common.enum';
import { GET_NOTIFICATIONS } from '../../apollo/user/query';
import { NotificationStatus } from '../enums/notification.enum';

export default function NotifIcon() {
	/** REQUEST IF NEEDED **/
	const [notifications, setNotifications] = useState<NotifMe[]>([]);

	const [notif, setnotif] = useState<NotifInquiry>({
		sort: 'createdAt',
		direction: Direction.DESC,
		limit: 10,
	});

	const {
		loading: getNotificationsLoading,
		data: getNotificationsData,
		error: getNotificationsError,
		refetch: getNotificationsRefetch,
	} = useQuery(GET_NOTIFICATIONS, {
		fetchPolicy: 'network-only',
		variables: {
			input: notif,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setNotifications(data?.getNotifications?.list);
		},
	});

	console.log('Loading:', getNotificationsLoading);
	console.log('##:', getNotificationsError);
	console.log('++', getNotificationsData, 'data>>>');

	// console.log('Notifications:', notifications);
	// console.log('--typeof', typeof notifications, '=>>>>');

	const waitNotificationsCount = notifications.filter((notifies) => {
		return notifies.notificationStatus === NotificationStatus.WAIT;
	});

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	// WE WILL COME BACK
	/** HANDLERS **/
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(e.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	// WE WILL COME BACK

	return (
		<Box className={'hover-line'}>
			<IconButton
				aria-label="cart"
				id="basic-button"
				aria-controls={open ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
			>
				<Badge badgeContent={waitNotificationsCount.length} color="error">
					<NotificationsOutlinedIcon className={'notification-icon'}></NotificationsOutlinedIcon>
				</Badge>
			</IconButton>
			<Menu
				anchorEl={anchorEl}
				id="account-menu"
				open={open}
				onClose={handleClose}
				// onClick={handleClose}
				PaperProps={{
					elevation: 0,
					sx: {
						maxHeight: '400px',
						overflow: 'auto',
						filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
						mt: 0.5,
						'& .MuiAvatar-root': {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						'&:before': {
							content: '""',
							display: 'block',
							position: 'absolute',
							top: 0,
							right: 10,
							width: 5,
							height: 10,
							bgcolor: 'background.paper',
							transform: 'translateY(-50%) rotate(45deg)',
							zIndex: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				<Stack className="basket-frame">
					<Box className="orders-main-wrapper">
						{notifications.map((notif: NotifMe) => {
							let message;
							if (notif.propertyId) {
								message = `${notif.authorId} liked a property you posted`;
							} else if (notif.articleId) {
								message = `${notif.authorId} liked an article you posted`;
							} else if (notif.authorId) {
								message = `${notif.authorNick} liked your profile`;
							} else {
								message = `Notification from ${notif.receiverId}`;
							}

							return (
								<Box key={notif._id} className="notification-item">
									<Typography variant="body2">{notif.notificationTitle}</Typography>
									<Typography variant="caption" color="text.secondary">
										{message}
									</Typography>
									<Typography variant="caption" color="text.secondary">
										{new Date(notif.createdAt).toLocaleString()}
									</Typography>
								</Box>
							);
						})}
					</Box>
				</Stack>
			</Menu>
		</Box>
	);
}
