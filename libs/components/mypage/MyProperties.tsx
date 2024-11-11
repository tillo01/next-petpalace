import React, { useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { PetCard } from './PetCard';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Pet } from '../../types/pet/pet';
import { AgentPetsInquiry } from '../../types/pet/pet.input';
import { T } from '../../types/common';
import { PetStatus } from '../../enums/pet.enum';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { UPDATE_PET } from '../../../apollo/user/mutation';
import { GET_SELLER_PETS } from '../../../apollo/user/query';
import { sweetConfirmAlert, sweetErrorHandling } from '../../sweetAlert';

const MyPets: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const [searchFilter, setSearchFilter] = useState<AgentPetsInquiry>(initialInput);
	const [sellerPets, setAgentPets] = useState<Pet[]>([]);
	const [total, setTotal] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** APOLLO REQUESTS **/

	const [updatePet] = useMutation(UPDATE_PET);
	const {
		loading: getAgentPets,
		data: getAgentPetsData,
		error: getAgentPetsError,
		refetch: getAgentPropertieRefetch,
	} = useQuery(GET_SELLER_PETS, {
		fetchPolicy: 'network-only',
		variables: {
			input: searchFilter,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentPets(data?.getAgentPets?.list);
			setTotal(data?.setAgentPets?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const changeStatusHandler = (value: PetStatus) => {
		setSearchFilter({ ...searchFilter, search: { petStatus: value } });
	};
	// DELETE HANDLER
	const deletePetHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to delete this pet')) {
				await updatePet({
					variables: {
						input: {
							_id: id,
							petStatus: 'DELETE',
						},
					},
				});

				await getAgentPropertieRefetch({ input: searchFilter });
			}
		} catch (err) {
			await sweetErrorHandling(err);
		}
	};

	const updatePetHandler = async (status: string, id: string) => {
		try {
			if (await sweetConfirmAlert(`Are you sure to change ${status} status`)) {
				await updatePet({
					variables: {
						input: {
							_id: id,
							petStatus: status,
						},
					},
				});
				await getAgentPropertieRefetch({ input: searchFilter });
			}
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	if (user?.memberType !== 'SELLER') {
		router.back();
	}

	if (device === 'mobile') {
		return <div>NESTAR PETS MOBILE</div>;
	} else {
		return (
			<div id="my-pet-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My Pets</Typography>
						<Typography className="sub-title">We are glad to see you again!</Typography>
					</Stack>
				</Stack>
				<Stack className="pet-list-box">
					<Stack className="tab-name-box">
						<Typography
							onClick={() => changeStatusHandler(PetStatus.ACTIVE)}
							className={searchFilter.search.petStatus === 'ACTIVE' ? 'active-tab-name' : 'tab-name'}
						>
							On Sale
						</Typography>
						<Typography
							onClick={() => changeStatusHandler(PetStatus.SOLD)}
							className={searchFilter.search.petStatus === 'SOLD' ? 'active-tab-name' : 'tab-name'}
						>
							On Sold
						</Typography>
					</Stack>
					<Stack className="list-box">
						<Stack className="listing-title-box">
							<Typography className="title-text">Listing title</Typography>
							<Typography className="title-text">Date Published</Typography>
							<Typography className="title-text">Status</Typography>
							<Typography className="title-text">View</Typography>
							{searchFilter.search.petStatus === 'ACTIVE' && <Typography className="title-text">Action</Typography>}
						</Stack>

						{sellerPets?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Pet found!</p>
							</div>
						) : (
							sellerPets.map((pet: Pet) => {
								return <PetCard pet={pet} deletePetHandler={deletePetHandler} updatePetHandler={updatePetHandler} />;
							})
						)}

						{sellerPets.length !== 0 && (
							<Stack className="pagination-config">
								<Stack className="pagination-box">
									<Pagination
										count={Math.ceil(total / searchFilter.limit)}
										page={searchFilter.page}
										shape="circular"
										color="primary"
										onChange={paginationHandler}
									/>
								</Stack>
								<Stack className="total-result">
									<Typography>{total} pet available</Typography>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		);
	}
};

MyPets.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			petStatus: 'ACTIVE',
		},
	},
};

export default MyPets;
