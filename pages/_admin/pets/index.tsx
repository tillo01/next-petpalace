import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, List, ListItem, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';

import { AllPetsInquiry } from '../../../libs/types/pet/pet.input';
import { Pet } from '../../../libs/types/pet/pet';
import { PetLocation, PetStatus } from '../../../libs/enums/pet.enum';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { PetUpdate } from '../../../libs/types/pet/pet.update';
import { useMutation, useQuery } from '@apollo/client';
import { REMOVE_PET_BY_ADMIN, UPDATE_PET_BY_ADMIN } from '../../../apollo/admin/mutation';
import { GET_ALL_PETS_BY_ADMIN } from '../../../apollo/admin/query';
import { PetPanelList } from '../../../libs/components/admin/pets/PetList';

const AdminPets: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [petsInquiry, setPetsInquiry] = useState<AllPetsInquiry>(initialInquiry);
	const [pets, setPets] = useState<Pet[]>([]);
	const [petsTotal, setPetsTotal] = useState<number>(0);
	const [value, setValue] = useState(petsInquiry?.search?.petStatus ? petsInquiry?.search?.petStatus : 'ALL');
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/

	const [updatePetByAdmin] = useMutation(UPDATE_PET_BY_ADMIN);
	const [removePetByAdmin] = useMutation(REMOVE_PET_BY_ADMIN);

	const {
		loading: getAllPetsByAdminLoading,
		data: getAllPetsByAdminData,
		error: getAllPetsByAdminError,
		refetch: getAllPetsByAdminRefetch,
	} = useQuery(GET_ALL_PETS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: petsInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data) => {
			setPets(data?.getAllPetsByAdmin?.list);
			setPetsTotal(data?.getAllPetsByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getAllPetsByAdminRefetch({ input: petsInquiry }).then();
	}, [petsInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		petsInquiry.page = newPage + 1;
		getAllPetsByAdminRefetch({ input: petsInquiry }).then();
		setPetsInquiry({ ...petsInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		petsInquiry.limit = parseInt(event.target.value, 10);
		petsInquiry.page = 1;
		getAllPetsByAdminRefetch({ input: petsInquiry }).then();
		setPetsInquiry({ ...petsInquiry });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);

		setPetsInquiry({ ...petsInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setPetsInquiry({ ...petsInquiry, search: { petStatus: PetStatus.ACTIVE } });
				break;
			case 'SOLD':
				setPetsInquiry({ ...petsInquiry, search: { petStatus: PetStatus.SOLD } });
				break;
			case 'DELETE':
				setPetsInquiry({ ...petsInquiry, search: { petStatus: PetStatus.DELETED } });
				break;
			default:
				delete petsInquiry?.search?.petStatus;
				setPetsInquiry({ ...petsInquiry });
				break;
		}
	};

	const removePetHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to remove?')) {
				await removePetByAdmin({
					variables: {
						input: id,
					},
				});
			}

			await getAllPetsByAdminRefetch({ input: petsInquiry });
			menuIconCloseHandler();
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const searchTypeHandler = async (newValue: string) => {
		try {
			setSearchType(newValue);

			if (newValue !== 'ALL') {
				setPetsInquiry({
					...petsInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...petsInquiry.search,
						petLocationList: [newValue as PetLocation],
					},
				});
			} else {
				delete petsInquiry?.search?.petLocationList;
				setPetsInquiry({ ...petsInquiry });
			}
		} catch (err: any) {
			console.log('searchTypeHandler: ', err.message);
		}
	};

	const updatePetHandler = async (updateData: PetUpdate) => {
		try {
			console.log('+updateData:', updateData);

			await updatePetByAdmin({
				variables: {
					input: updateData,
				},
			});

			menuIconCloseHandler();
			await getAllPetsByAdminRefetch({ input: petsInquiry });
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Typography variant={'h2'} className={'tit'} sx={{ mb: '24px' }}>
				Pet List
			</Typography>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'ALL')}
									value="ALL"
									className={value === 'ALL' ? 'li on' : 'li'}
								>
									All
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'ACTIVE')}
									value="ACTIVE"
									className={value === 'ACTIVE' ? 'li on' : 'li'}
								>
									Active
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'SOLD')}
									value="SOLD"
									className={value === 'SOLD' ? 'li on' : 'li'}
								>
									Sold
								</ListItem>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'DELETE')}
									value="DELETE"
									className={value === 'DELETE' ? 'li on' : 'li'}
								>
									Delete
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<Select sx={{ width: '160px', mr: '20px' }} value={searchType}>
									<MenuItem value={'ALL'} onClick={() => searchTypeHandler('ALL')}>
										ALL
									</MenuItem>
									{Object.values(PetLocation).map((location: string) => (
										<MenuItem value={location} onClick={() => searchTypeHandler(location)} key={location}>
											{location}
										</MenuItem>
									))}
								</Select>
							</Stack>
							<Divider />
						</Box>
						<PetPanelList
							pets={pets}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updatePetHandler={updatePetHandler}
							removePetHandler={removePetHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={petsTotal}
							rowsPerPage={petsInquiry?.limit}
							page={petsInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminPets.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminPets);
