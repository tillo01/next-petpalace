import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Pet } from '../../types/pet/pet';
import { PetsInquiry } from '../../types/pet/pet.input';
import { T } from '../../types/common';
import { useRouter } from 'next/router';
import { GET_PETS } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { PetCard } from '../mypage/PetCard';

const MyPets: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { memberId } = router.query;
	const [searchFilter, setSearchFilter] = useState<PetsInquiry>({ ...initialInput });
	const [sellerPets, setAgentPets] = useState<Pet[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/

	const {
		loading: getPetsLoading,
		data: getPetsData,
		error: getPetsError,
		refetch: getPetsRefetch,
	} = useQuery(GET_PETS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter?.search?.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: any) => {
			setAgentPets(data?.getPets?.list);
			setTotal(data?.getPets?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getPetsRefetch().then();
	}, [searchFilter]);

	useEffect(() => {
		if (memberId)
			setSearchFilter({ ...initialInput, search: { ...initialInput.search, memberId: memberId as string } });
	}, [memberId]);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	if (device === 'mobile') {
		return <div>NESTAR PETS MOBILE</div>;
	} else {
		return (
			<div id="member-pets-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">Pets</Typography>
					</Stack>
				</Stack>
				<Stack className="pets-list-box">
					<Stack className="list-box">
						{sellerPets?.length > 0 && (
							<Stack className="listing-title-box">
								<Typography className="title-text">Listing title</Typography>
								<Typography className="title-text">Date Published</Typography>
								<Typography className="title-text">Status</Typography>
								<Typography className="title-text">View</Typography>
							</Stack>
						)}
						{sellerPets?.length === 0 && (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No Pet found!</p>
							</div>
						)}
						{sellerPets?.map((pet: Pet) => {
							return <PetCard pet={pet} memberPage={true} key={pet?._id} />;
						})}

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
			memberId: '',
		},
	},
};

export default MyPets;
