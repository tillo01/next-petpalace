import React from 'react';
import { NextPage } from 'next';
import { Stack, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import useDeviceDetect from '../../../../libs/hooks/useDeviceDetect';
import TuiEditor from './FAQTeditor';
import FAQTeditor from './FAQTeditor';

const WriteFAQ: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <>ARTICLE PAGE MOBILE</>;
	} else
		return (
			<div id="write-article-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">Write FAQ</Typography>
						<Typography className="sub-title">Write about Frequently Asked Questions</Typography>
					</Stack>
				</Stack>
				<FAQTeditor />
			</div>
		);
};

export default WriteFAQ;
