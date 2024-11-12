import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Filter from '../../libs/components/pet/Filter';
import { useRouter } from 'next/router';
import { PetsInquiry } from '../../libs/types/pet/pet.input';
import { Pet } from '../../libs/types/pet/pet';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Direction, Message } from '../../libs/enums/common.enum';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PETS } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { LIKE_TARGET_PET } from '../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { PetCard } from '../../libs/components/mypage/PetCard';
import PetBigCard from '../../libs/components/common/PetBigCard';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const PetList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<PetsInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [pets, setPets] = useState<Pet[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('New');

	/** APOLLO REQUESTS **/

	const [likeTargetPet] = useMutation(LIKE_TARGET_PET);

	const likePetHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetPet({ variables: { input: id } });

			await getPetsRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('Erron on likePetHandler', err);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const {
		loading: getPetsLoading,
		data: getPetsData,
		error: getPetsError,
		refetch: getPetsRefetch,
	} = useQuery(GET_PETS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setPets(data?.getPets?.list);
			setTotal(data?.getPets?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
		}

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	useEffect(() => {
		getPetsRefetch();
	}, [searchFilter]);

	/** HANDLERS **/
	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(`/pet?input=${JSON.stringify(searchFilter)}`, `/pet?input=${JSON.stringify(searchFilter)}`, {
			scroll: false,
		});
		setCurrentPage(value);
	};

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.currentTarget.id) {
			case 'new':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: Direction.ASC });
				setFilterSortName('New');
				break;
			case 'lowest':
				setSearchFilter({ ...searchFilter, sort: 'petPrice', direction: Direction.ASC });
				setFilterSortName('Lowest Price');
				break;
			case 'highest':
				setSearchFilter({ ...searchFilter, sort: 'petPrice', direction: Direction.DESC });
				setFilterSortName('Highest Price');
		}
		setSortingOpen(false);
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return <h1>PETS MOBILE</h1>;
	} else {
		return (
			<div id="pet-list-page" style={{ position: 'relative' }}>
				<div className="container">
					<Box component={'div'} className={'right'}>
						<span>Sort by</span>
						<div>
							<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
								{filterSortName}
							</Button>
							<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
								<MenuItem
									onClick={sortingHandler}
									id={'new'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									New
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'lowest'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									Lowest Price
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'highest'}
									disableRipple
									sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									Highest Price
								</MenuItem>
							</Menu>
						</div>
					</Box>
					<Stack className={'pet-page'}>
						<Stack className={'filter-config'}>
							{/* @ts-ignore */}
							<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
						</Stack>
						<Stack className="main-config" mb={'76px'}>
							<Stack className={'list-config'}>
								{pets?.length === 0 ? (
									<div className={'no-data'}>
										<img src="/img/icons/icoAlert.svg" alt="" />
										<p>No Pets found!</p>
									</div>
								) : (
									pets.map((pet: Pet) => {
										return <PetBigCard pet={pet} key={pet?._id} likePetHandler={likePetHandler} />;
									})
								)}
							</Stack>
							<Stack className="pagination-config">
								{pets.length !== 0 && (
									<Stack className="pagination-box">
										<Pagination
											page={currentPage}
											count={Math.ceil(total / searchFilter.limit)}
											onChange={handlePaginationChange}
											shape={'circular'}
											// @ts-ignore
											color={'success'}
										/>
									</Stack>
								)}

								{pets.length !== 0 && (
									<Stack className="total-result">
										<Typography>
											Total {total} pet{total > 1 ? 's' : 't'} in the stock
										</Typography>
									</Stack>
								)}
							</Stack>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};

PetList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			squaresRange: {
				start: 0,
				end: 500,
			},
			pricesRange: {
				start: 0,
				end: 2000000,
			},
		},
	},
};

export default withLayoutBasic(PetList);
