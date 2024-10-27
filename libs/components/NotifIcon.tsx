/** @format */

import React, { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../types/common';
import { Noitfies, NotifInquiry, NotifMe } from '../types/notigication.ts/notif';
import { Direction } from '../enums/common.enum';
import { GET_NOTIFICATIONS } from '../../apollo/user/query';
import { NotificationStatus } from '../enums/notification.enum';
import { UPDATE_NOTIFICATIONS } from '../../apollo/user/mutation';
import { NotifUpdate } from '../types/notigication.ts/notif.update';
import { sweetErrorHandling } from '../sweetAlert';

export default function NotifIcon() {
	/** REQUEST IF NEEDED **/
	const [updateNotifications] = useMutation(UPDATE_NOTIFICATIONS);

	const [notifications, setNotifications] = useState<NotifMe[]>([]);

	const [notif, setnotif] = useState<NotifInquiry>({
		sort: 'createdAt',
		direction: Direction.DESC,
		limit: 1000,
	});
	const [updateNotifStatus, setUpdateNotifStatus] = useState<NotifUpdate>();

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

	const updateNotifsHandler = async (notifID: string) => {
		const updateData = { _id: notifID, notificationStatus: NotificationStatus.READ };
		try {
			await updateNotifications({
				variables: {
					input: updateData,
				},
			});
			setNotifications((prevNotifications: any) => {
				return prevNotifications.map((notification: any) => {
					if (notification._id === notifID) {
						return { ...notification, notificationStatus: NotificationStatus.READ };
					}

					return notification;
				});
			});

			await getNotificationsRefetch({ input: notif });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

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
					{notifications.map((notif: NotifMe) => {
						let message;
						if (notif.commentContent) {
							message = `${notif.authorNick} commented on your post: ${notif.commentContent}`;
						} else if (notif.propertyTitle) {
							message = `${notif.authorNick} liked a property you posted: ${notif.propertyTitle}`;
						} else if (notif.articleTitle) {
							message = `${notif.authorNick} liked an article you posted: ${notif.articleTitle}`;
						} else if (notif.authorNick) {
							message = `${notif.authorNick} liked your profile`;
						} else {
							message = `Notification from ${notif.receiverId}`;
						}

						return (
							<Box
								key={notif._id} // Use notification ID as the key
								className="orders-main-wrapper"
								onClick={() => updateNotifsHandler(notif._id)} // Pass the specific ID to update
								style={{
									cursor: 'pointer',
									padding: '8px',
									backgroundColor: notif.notificationStatus === NotificationStatus.WAIT ? '#f0f0f0' : '#ffffff', // Gray for unread, white for read
								}}
							>
								<span
									style={{
										width: '10px',
										height: '10px',
										borderRadius: '50%',
										backgroundColor: notif.notificationStatus === 'READ' ? 'lightgray' : 'green',
										display: 'inline-block',
										marginRight: '8px',
									}}
								/>
								<Box className="notification-item">
									<Typography variant="body2">{notif.notificationTitle}</Typography>
									<Typography variant="caption" color="text.secondary">
										{message}
									</Typography>
									<Typography variant="caption" color="text.secondary">
										{new Date(notif.createdAt).toLocaleString()}
									</Typography>
								</Box>
							</Box>
						);
					})}
				</Stack>
			</Menu>
		</Box>
	);
}
