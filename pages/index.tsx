import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import PopularPets from '../libs/components/homepage/PopularPets';
import TopSellers from '../libs/components/homepage/TopSellers';
import Events from '../libs/components/homepage/Events';
import TrendPets from '../libs/components/homepage/TrendPets';
import TopPets from '../libs/components/homepage/TopPets';
import { Stack } from '@mui/material';
import Advertisement from '../libs/components/homepage/Advertisement';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Service from '../libs/components/homepage/Service';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<TrendPets />
				<PopularPets />
				<Advertisement />
				<TopPets />
				<TopSellers />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<Service />
				<PopularPets />
				<TrendPets />
				<TopSellers />
				<Advertisement />
				<TopPets />
				<CommunityBoards />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
