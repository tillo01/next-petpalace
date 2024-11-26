import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Avatar, Box, Button, Paper, Stack, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import useDeviceDetect from '../../../../libs/hooks/useDeviceDetect';
import { userVar } from '../../../../apollo/store';
import '@toast-ui/editor/dist/toastui-editor.css';
const FAQTeditor = dynamic(() => import('./FAQTeditor'), { ssr: false });

import { useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';

const WriteFAQ: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	const [isEditorLoaded, setIsEditorLoaded] = useState(false);

	useEffect(() => {
		setIsEditorLoaded(true);
	}, []);

	if (device === 'mobile') {
		return <>ARTICLE PAGE MOBILE</>;
	} else
		return (
			<div id="write-article-page">
				<Stack className="main-title-box">
					<Stack style={{ width: '70px', height: '70px', marginLeft: '65px' }} className={'logo-box'}>
						<img src={'/img/logo/Logo.bg.png'} alt={'logo'} />
					</Stack>
					<Paper
						elevation={1}
						sx={{
							display: 'flex',
							alignItems: 'center',
							padding: 2,
							marginTop: 2,
							borderRadius: 2,
							backgroundColor: '#f9f9f9',
							width: 'fit-content',
						}}
					>
						<Avatar
							src={
								user?.memberImage
									? `${process.env.REACT_APP_API_URL}/${user?.memberImage}`
									: '/img/profile/defaultUser.svg'
							}
							sx={{ width: 48, height: 48, marginRight: 2 }}
						/>
						<Box>
							<Typography variant="subtitle1" fontWeight="bold">
								{user?.memberNick || 'Admin'}
							</Typography>
							<Typography variant="body2" color="textSecondary">
								{user?.memberPhone || '+010345663333'}
							</Typography>
							<Button variant="contained" color="primary" onClick={() => router.push(`/_admin/`)}>
								Clicl to Admin Page
							</Button>
						</Box>
					</Paper>
					<Stack flexDirection={'column'} alignItems={'center'} className="right-box">
						<Typography className="main-title">Write FAQ/NOTICE</Typography>
						<Typography className="sub-title">Write about Frequently Asked Questions and NOTICE </Typography>
					</Stack>
				</Stack>
				<div>{isEditorLoaded ? <FAQTeditor /> : <div>Loading...</div>}</div>
			</div>
		);
};

export default WriteFAQ;
