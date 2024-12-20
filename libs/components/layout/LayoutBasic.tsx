import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useTranslation } from 'next-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t, i18n } = useTranslation('common');
		const device = useDeviceDetect();
		const [authHeader, setAuthHeader] = useState<boolean>(false);
		const user = useReactiveVar(userVar);

		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '',
				bgImage = '';

			switch (router.pathname) {
				case '/pet':
					title = 'Adorable Pets';
					desc = 'Search the most adorable doggy and catty!';
					bgImage = '/img/banner/petsPage.webp';
					break;
				case '/seller':
					title = 'Sellers';
					desc = 'Pets / For Adoption';
					bgImage = '/img/banner/dog.webp';
					break;
				case '/seller/detail':
					title = 'Seller Page';
					desc = 'Pets / For Adoption';
					bgImage = '/img/banner/otherPage.webp';
					break;
				case '/mypage':
					title = 'my page';
					desc = 'Pets / For Adoption';
					bgImage = '/img/banner/myPage.webp';
					break;
				case '/community':
					title = 'Community';
					desc = 'Pets / For Adoption';
					bgImage = '/img/banner/communityPage.webp';
					break;
				case '/community/detail':
					title = 'Community Detail';
					desc = 'Pets / For Adoption';
					bgImage = '/img/banner/communityPage.webp';
					break;
				case '/cs':
					title = 'CS';
					desc = 'We are glad to see you again!';
					bgImage = '/img/banner/dog.webp';
					break;
				case '/account/join':
					title = 'Login/Signup';
					desc = 'Process of login/signup';
					bgImage = '/img/banner/dog.webp';
					setAuthHeader(true);
					break;
				case '/member':
					title = 'Member Page';
					desc = 'Pets / For Adoption';
					bgImage = '/img/banner/follower.jpg';
					break;
				default:
					break;
			}

			return { title, desc, bgImage };
		}, [router.pathname]);

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>Pet-Palace</title>
						<meta name={'title'} content={`Pet-Palace`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>Pet-Palace</title>
						<meta name={'title'} content={`Pet-Palace`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack
							className={`header-basic ${authHeader && 'auth'}`}
							style={{
								backgroundImage: `url(${memoizedValues.bgImage})`,
								backgroundSize: 'cover',
								boxShadow: 'inset 10px 40px 150px 40px rgb(24 22 36)',
							}}
						>
							<Stack className={'container'}>
								<strong>{t(memoizedValues.title)}</strong>
								<span>{t(memoizedValues.desc)}</span>
							</Stack>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Chat />
						{/* {user?._id && <Chat />} */}

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutBasic;
