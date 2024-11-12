import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	Button,
	OutlinedInput,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Tooltip,
	IconButton,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { PetLocation, PetType } from '../../enums/pet.enum';
import { PetsInquiry } from '../../types/pet/pet.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { petWeight } from '../../config';
import RefreshIcon from '@mui/icons-material/Refresh';

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface FilterType {
	searchFilter: PetsInquiry;
	setSearchFilter: any;
	initialInput: PetsInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [petLocation, setPetLocation] = useState<PetLocation[]>(Object.values(PetLocation));
	const [petType, setPetType] = useState<PetType[]>(Object.values(PetType));
	const [searchText, setSearchText] = useState<string>('');
	const [showMore, setShowMore] = useState<boolean>(false);

	/** LIFECYCLES **/
	useEffect(() => {
		const queryParams = JSON.stringify({
			...searchFilter,
			search: {
				...searchFilter.search,
			},
		});

		if (searchFilter?.search?.locationList?.length == 0) {
			delete searchFilter.search.locationList;
			setShowMore(false);
			JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
				},
			});
		}

		if (searchFilter?.search?.typeList?.length == 0) {
			delete searchFilter.search.typeList;
			router
				.push(
					`/pet?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/pet?input=${queryParams}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.agesList?.length == 0) {
			delete searchFilter.search.agesList;
			router
				.push(
					`/pet?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/pet?input=${queryParams}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.options?.length == 0) {
			delete searchFilter.search.options;
			router
				.push(
					`/pet?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/pet?input=${queryParams}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.agesList?.length == 0) {
			delete searchFilter.search.agesList;
			router
				.push(
					`/pet?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/pet?input=${queryParams}`,
					{ scroll: false },
				)
				.then();
		}

		if (searchFilter?.search?.locationList) setShowMore(true);
	}, [searchFilter]);

	/** HANDLERS **/
	const petLocationSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/pet?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						`/pet?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, locationList: [...(searchFilter?.search?.locationList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.locationList?.includes(value)) {
					await router.push(
						`/pet?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						`/pet?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								locationList: searchFilter?.search?.locationList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('petLocationSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, petLocationSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const petTypeSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/pet?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						`/pet?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, typeList: [...(searchFilter?.search?.typeList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.typeList?.includes(value)) {
					await router.push(
						`/pet?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						`/pet?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								typeList: searchFilter?.search?.typeList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				if (searchFilter?.search?.typeList?.length == 0) {
					alert('error');
				}

				console.log('petTypeSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, petTypeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const petHeightSelectHandler = useCallback(
		async (number: Number) => {
			try {
				if (number !== 0) {
					if (searchFilter?.search?.agesList?.includes(number)) {
						await router.push(
							`/pet?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									agesList: searchFilter?.search?.heightsList?.filter((item: Number) => item !== number),
								},
							})}`,
							`/pet?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									agesList: searchFilter?.search?.heightsList?.filter((item: Number) => item !== number),
								},
							})}`,
							{ scroll: false },
						);
					} else {
						await router.push(
							`/pet?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, heightsList: [...(searchFilter?.search?.agesList || []), number] },
							})}`,
							`/pet?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, heightsList: [...(searchFilter?.search?.agesList || []), number] },
							})}`,
							{ scroll: false },
						);
					}
				} else {
					delete searchFilter?.search.heightsList;
					setSearchFilter({ ...searchFilter });

					await router.push(
						`/pet?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						`/pet?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('petHeightSelectHandler:', number);
			} catch (err: any) {
				console.log('ERROR, petHeightSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const petOptionSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/pet?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, options: [...(searchFilter?.search?.options || []), value] },
						})}`,
						`/pet?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, options: [...(searchFilter?.search?.options || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.options?.includes(value)) {
					await router.push(
						`/pet?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: searchFilter?.search?.options?.filter((item: string) => item !== value),
							},
						})}`,
						`/pet?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								options: searchFilter?.search?.options?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('petOptionSelectHandler:', e.target.value);
			} catch (err: any) {
				console.log('ERROR, petOptionSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const petAgeSelectHandler = useCallback(
		async (number: Number) => {
			try {
				if (number != 0) {
					if (searchFilter?.search?.agesList?.includes(number)) {
						await router.push(
							`/pet?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									agesList: searchFilter?.search?.agesList?.filter((item: Number) => item !== number),
								},
							})}`,
							`/pet?input=${JSON.stringify({
								...searchFilter,
								search: {
									...searchFilter.search,
									agesList: searchFilter?.search?.agesList?.filter((item: Number) => item !== number),
								},
							})}`,
							{ scroll: false },
						);
					} else {
						await router.push(
							`/pet?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, agesList: [...(searchFilter?.search?.agesList || []), number] },
							})}`,
							`/pet?input=${JSON.stringify({
								...searchFilter,
								search: { ...searchFilter.search, agesList: [...(searchFilter?.search?.agesList || []), number] },
							})}`,
							{ scroll: false },
						);
					}
				} else {
					delete searchFilter?.search.agesList;
					setSearchFilter({ ...searchFilter });
					await router.push(
						`/pet?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						`/pet?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						{ scroll: false },
					);
				}

				console.log('petAgeSelectHandler:', number);
			} catch (err: any) {
				console.log('ERROR, petAgeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const petWeightHandler = useCallback(
		async (e: any, type: string) => {
			const value = e.target.value;

			if (type == 'start') {
				await router.push(
					`/pet?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							weightRange: { ...searchFilter.search.weightRange, start: value },
						},
					})}`,
					`/pet?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							weightRange: { ...searchFilter.search.weightRange, start: value },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/pet?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							weightRange: { ...searchFilter.search.weightRange, end: value },
						},
					})}`,
					`/pet?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							weightRange: { ...searchFilter.search.weightRange, end: value },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const petPriceHandler = useCallback(
		async (value: number, type: string) => {
			if (type == 'start') {
				await router.push(
					`/pet?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					`/pet?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/pet?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					`/pet?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const refreshHandler = async () => {
		try {
			setSearchText('');
			await router.push(`/pet?input=${JSON.stringify(initialInput)}`, `/pet?input=${JSON.stringify(initialInput)}`, {
				scroll: false,
			});
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>PETS FILTER</div>;
	} else {
		return (
			<Stack className={'filter-main'}>
				<Stack className={'find-your-home'} mb={'40px'}>
					<Typography className={'title-main'}>Find Your Home</Typography>
					<Stack className={'input-box'}>
						<OutlinedInput
							value={searchText}
							type={'text'}
							className={'search-input'}
							placeholder={'What are you looking for?'}
							onChange={(e: any) => setSearchText(e.target.value)}
							onKeyDown={(event: any) => {
								if (event.key == 'Enter') {
									setSearchFilter({
										...searchFilter,
										search: { ...searchFilter.search, text: searchText },
									});
								}
							}}
							endAdornment={
								<>
									<CancelRoundedIcon
										onClick={() => {
											setSearchText('');
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: '' },
											});
										}}
									/>
								</>
							}
						/>
						<img src={'/img/icons/search_icon.png'} alt={''} />
						<Tooltip title="Reset">
							<IconButton onClick={refreshHandler}>
								<RefreshIcon />
							</IconButton>
						</Tooltip>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<p className={'title'} style={{ textShadow: '0px 3px 4px #b9b9b9' }}>
						Location
					</p>
					<Stack
						className={`pet-location`}
						style={{ height: showMore ? '253px' : '115px' }}
						onMouseEnter={() => setShowMore(true)}
						onMouseLeave={() => {
							if (!searchFilter?.search?.locationList) {
								setShowMore(false);
							}
						}}
					>
						{petLocation.map((location: string) => {
							return (
								<Stack className={'input-box'} key={location}>
									<Checkbox
										id={location}
										className="pet-checkbox"
										color="default"
										size="small"
										value={location}
										checked={(searchFilter?.search?.locationList || []).includes(location as PetLocation)}
										onChange={petLocationSelectHandler}
									/>
									<label htmlFor={location} style={{ cursor: 'pointer' }}>
										<Typography className="pet-type">{location}</Typography>
									</label>
								</Stack>
							);
						})}
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Pet Type</Typography>
					{petType.map((type: string) => (
						<Stack className={'input-box'} key={type}>
							<Checkbox
								id={type}
								className="pet-checkbox"
								color="default"
								size="small"
								value={type}
								onChange={petTypeSelectHandler}
								checked={(searchFilter?.search?.typeList || []).includes(type as PetType)}
							/>
							<label style={{ cursor: 'pointer' }}>
								<Typography className="pet_type">{type}</Typography>
							</label>
						</Stack>
					))}
				</Stack>
				<Stack className={''}>
					<Stack className={'find-your-home'} mb={'30px'}>
						<Typography className={'title'}>Height</Typography>
						<Stack className="button-group">
							<Stack className="button-group-row">
								<Stack flexDirection={'row'}>
									<Button
										sx={{
											borderRadius: '12px 0 0 12px',
											border: !searchFilter?.search?.heightsList ? '2px solid #181A20' : '1px solid #b9b9b9',
										}}
										onClick={() => petHeightSelectHandler(0)}
									>
										Any
									</Button>
									<Button
										sx={{
											borderRadius: 0,
											border: searchFilter?.search?.heightsList?.includes(5)
												? '2px solid #181A20'
												: '1px solid #b9b9b9',
											borderLeft: searchFilter?.search?.heightsList?.includes(5) ? undefined : 'none',
										}}
										onClick={() => petHeightSelectHandler(5)}
									>
										5
									</Button>
									<Button
										sx={{
											borderRadius: 0,
											border: searchFilter?.search?.heightsList?.includes(10)
												? '2px solid #181A20'
												: '1px solid #b9b9b9',
											borderLeft: searchFilter?.search?.heightsList?.includes(10) ? undefined : 'none',
										}}
										onClick={() => petHeightSelectHandler(10)}
									>
										10
									</Button>
									<Button
										sx={{
											borderRadius: 0,
											border: searchFilter?.search?.heightsList?.includes(15)
												? '2px solid #181A20'
												: '1px solid #b9b9b9',
											borderLeft: searchFilter?.search?.heightsList?.includes(15) ? undefined : 'none',
										}}
										onClick={() => petHeightSelectHandler(15)}
									>
										15
									</Button>
									<Button
										sx={{
											borderRadius: 0,
											border: searchFilter?.search?.heightsList?.includes(20)
												? '2px solid #181A20'
												: '1px solid #b9b9b9',
											borderLeft: searchFilter?.search?.heightsList?.includes(20) ? undefined : 'none',
											borderRight: searchFilter?.search?.heightsList?.includes(20) ? undefined : 'none',
										}}
										onClick={() => petHeightSelectHandler(20)}
									>
										20
									</Button>
									<Button
										sx={{
											border: searchFilter?.search?.heightsList?.includes(25)
												? '2px solid #181A20'
												: '1px solid #b9b9b9',
										}}
										onClick={() => petHeightSelectHandler(25)}
									>
										25
									</Button>
								</Stack>

								<Stack flexDirection={'row'}>
									<Button
										sx={{
											border: searchFilter?.search?.heightsList?.includes(30)
												? '2px solid #181A20'
												: '1px solid #b9b9b9',
										}}
										onClick={() => petHeightSelectHandler(30)}
									>
										30
									</Button>
									<Button
										sx={{
											border: searchFilter?.search?.heightsList?.includes(35)
												? '2px solid #181A20'
												: '1px solid #b9b9b9',
										}}
										onClick={() => petHeightSelectHandler(35)}
									>
										35
									</Button>
									<Button
										sx={{
											border: searchFilter?.search?.heightsList?.includes(40)
												? '2px solid #181A20'
												: '1px solid #b9b9b9',
										}}
										onClick={() => petHeightSelectHandler(40)}
									>
										40
									</Button>
									<Button
										sx={{
											border: searchFilter?.search?.heightsList?.includes(45)
												? '2px solid #181A20'
												: '1px solid #b9b9b9',
										}}
										onClick={() => petHeightSelectHandler(45)}
									>
										45
									</Button>
									<Button
										sx={{
											borderRadius: '0 12px 12px 0',
											border: searchFilter?.search?.heightsList?.includes(50)
												? '2px solid #181A20'
												: '1px solid #b9b9b9',
										}}
										onClick={() => petHeightSelectHandler(50)}
									>
										50+
									</Button>
								</Stack>
							</Stack>
						</Stack>
					</Stack>
					<Stack className={'find-your-home'} mb={'30px'}>
						<Typography className={'title'}>Ages</Typography>
						<Stack className="button-group">
							<Stack className="button-group-row">
								<Stack flexDirection={'row'}>
									<Button
										sx={{
											borderRadius: '12px 0 0 12px',
											border: !searchFilter?.search?.agesList ? '2px solid #fff' : '1px solid #b9b9b9',
										}}
										onClick={() => petAgeSelectHandler(0)}
									>
										Any
									</Button>
									<Button
										sx={{
											borderRadius: 0,
											border: searchFilter?.search?.agesList?.includes(1) ? '2px solid #fff' : '1px solid #b9b9b9',
											borderLeft: searchFilter?.search?.agesList?.includes(1) ? undefined : 'none',
										}}
										onClick={() => petAgeSelectHandler(1)}
									>
										1
									</Button>
									<Button
										sx={{
											borderRadius: 0,
											border: searchFilter?.search?.agesList?.includes(2) ? '2px solid #fff' : '1px solid #b9b9b9',
											borderLeft: searchFilter?.search?.agesList?.includes(2) ? undefined : 'none',
										}}
										onClick={() => petAgeSelectHandler(2)}
									>
										2
									</Button>
									<Button
										sx={{
											borderRadius: 0,
											border: searchFilter?.search?.agesList?.includes(3) ? '2px solid #fff' : '1px solid #b9b9b9',
											borderLeft: searchFilter?.search?.agesList?.includes(3) ? undefined : 'none',
										}}
										onClick={() => petAgeSelectHandler(3)}
									>
										3
									</Button>
									<Button
										sx={{
											borderRadius: 0,
											border: searchFilter?.search?.agesList?.includes(4) ? '2px solid #fff' : '1px solid #b9b9b9',
											borderLeft: searchFilter?.search?.agesList?.includes(4) ? undefined : 'none',
											// borderRight: false ? undefined : 'none',
										}}
										onClick={() => petAgeSelectHandler(4)}
									>
										4
									</Button>
									<Button
										sx={{
											border: searchFilter?.search?.agesList?.includes(5) ? '2px solid #fff' : '1px solid #b9b9b9',
											borderLeft: searchFilter?.search?.agesList?.includes(5) ? undefined : 'none',
										}}
										onClick={() => petAgeSelectHandler(5)}
									>
										5
									</Button>
									<Button
										sx={{
											border: searchFilter?.search?.agesList?.includes(6) ? '2px solid #fff' : '1px solid #b9b9b9',
											borderLeft: searchFilter?.search?.agesList?.includes(6) ? undefined : 'none',
										}}
										onClick={() => petAgeSelectHandler(6)}
									>
										6
									</Button>
									<Button
										sx={{
											border: searchFilter?.search?.agesList?.includes(7) ? '2px solid #fff' : '1px solid #b9b9b9',
											borderLeft: searchFilter?.search?.agesList?.includes(7) ? undefined : 'none',
										}}
										onClick={() => petAgeSelectHandler(7)}
									>
										7
									</Button>
									<Button
										sx={{
											border: searchFilter?.search?.agesList?.includes(8) ? '2px solid #fff' : '1px solid #b9b9b9',
											borderLeft: searchFilter?.search?.agesList?.includes(8) ? undefined : 'none',
										}}
										onClick={() => petAgeSelectHandler(8)}
									>
										8
									</Button>
								</Stack>
								<Stack flexDirection={'row'}>
									<Button
										sx={{
											border: searchFilter?.search?.agesList?.includes(9) ? '2px solid #fff' : '1px solid #b9b9b9',
											borderLeft: searchFilter?.search?.agesList?.includes(9) ? undefined : 'none',
										}}
										onClick={() => petAgeSelectHandler(9)}
									>
										9
									</Button>
									<Button
										sx={{
											border: searchFilter?.search?.agesList?.includes(10) ? '2px solid #fff' : '1px solid #b9b9b9',
											borderLeft: searchFilter?.search?.agesList?.includes(10) ? undefined : 'none',
										}}
										onClick={() => petAgeSelectHandler(10)}
									>
										10
									</Button>
									<Button
										sx={{
											border: searchFilter?.search?.agesList?.includes(11) ? '2px solid #fff' : '1px solid #b9b9b9',
											borderLeft: searchFilter?.search?.agesList?.includes(11) ? undefined : 'none',
										}}
										onClick={() => petAgeSelectHandler(11)}
									>
										11
									</Button>
									<Button
										sx={{
											border: searchFilter?.search?.agesList?.includes(12) ? '2px solid #fff' : '1px solid #b9b9b9',
											borderLeft: searchFilter?.search?.agesList?.includes(12) ? undefined : 'none',
										}}
										onClick={() => petAgeSelectHandler(12)}
									>
										12
									</Button>
									<Button
										sx={{
											border: searchFilter?.search?.agesList?.includes(13) ? '2px solid #fff' : '1px solid #b9b9b9',
											borderLeft: searchFilter?.search?.agesList?.includes(13) ? undefined : 'none',
										}}
										onClick={() => petAgeSelectHandler(13)}
									>
										13
									</Button>
									<Button
										sx={{
											border: searchFilter?.search?.agesList?.includes(14) ? '2px solid #fff' : '1px solid #b9b9b9',
											borderLeft: searchFilter?.search?.agesList?.includes(14) ? undefined : 'none',
										}}
										onClick={() => petAgeSelectHandler(14)}
									>
										14
									</Button>
									<Button
										sx={{
											borderRadius: '0 12px 12px 0',
											border: searchFilter?.search?.agesList?.includes(15) ? '2px solid #fff' : '1px solid #b9b9b9',
											borderLeft: searchFilter?.search?.agesList?.includes(15) ? undefined : 'none',
										}}
										onClick={() => petAgeSelectHandler(15)}
									>
										15
									</Button>
								</Stack>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
				<Stack className={'find-your-home'} mb={'30px'}>
					<Typography className={'title'}>Options</Typography>
					<Stack className={'input-box'}>
						<Checkbox
							id={'Sell'}
							className="pet-checkbox"
							size="small"
							value={'petSell'}
							checked={(searchFilter?.search?.options || []).includes('petSell')}
							onChange={petOptionSelectHandler}
							color="success"
						/>
						<label htmlFor={'Sell'} style={{ cursor: 'pointer' }}>
							<Typography className="propert-type">Sell</Typography>
						</label>
					</Stack>
					<Stack className={'input-box'}>
						<Checkbox
							id={'Adoption'}
							className="pet-checkbox"
							size="small"
							value={'petAdoption'}
							checked={(searchFilter?.search?.options || []).includes('petAdoption')}
							onChange={petOptionSelectHandler}
							color={'default'}
						/>
						<label htmlFor={'Adoption'} style={{ cursor: 'pointer' }}>
							<Typography className="propert-type">Adoption</Typography>
						</label>
					</Stack>
				</Stack>
				<Stack className={''}>
					<Stack className={'find-your-home'} mb={'30px'}>
						<Typography className={'title'}>Weight</Typography>
						<Stack className="weight-year-input">
							<FormControl>
								<InputLabel id="demo-simple-select-label">Min</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									color="success"
									value={searchFilter?.search?.weightRange?.start}
									label="Min"
									onChange={(e: any) => petWeightHandler(e, 'start')}
									MenuProps={MenuProps}
								>
									{petWeight
										.filter((weight) => weight <= 13)
										.map((weight) => (
											<MenuItem value={weight} key={weight}>
												{weight}
											</MenuItem>
										))}
								</Select>
							</FormControl>
							<div className="central-divider"></div>
							<FormControl>
								<InputLabel id="demo-simple-select-label">Max</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									color="success"
									value={searchFilter?.search?.weightRange?.end}
									label="Max"
									onChange={(e: any) => petWeightHandler(e, 'end')}
									MenuProps={MenuProps}
								>
									{petWeight
										.filter((weight) => weight > 13)
										.map((weight) => (
											<MenuItem value={weight} key={weight}>
												{weight}
											</MenuItem>
										))}
								</Select>
							</FormControl>
						</Stack>
					</Stack>
					<Stack className={'find-your-home'}>
						<Typography className={'title'}>Price Range</Typography>
						<Stack className="weight-year-input">
							<input
								type="number"
								placeholder="$ min"
								min={0}
								value={searchFilter?.search?.pricesRange?.start ?? 0}
								onChange={(e: any) => {
									if (e.target.value >= 0) {
										petPriceHandler(e.target.value, 'start');
									}
								}}
							/>
							<div className="central-divider"></div>
							<input
								type="number"
								placeholder="$ max"
								value={searchFilter?.search?.pricesRange?.end ?? 0}
								onChange={(e: any) => {
									if (e.target.value >= 0) {
										petPriceHandler(e.target.value, 'end');
									}
								}}
							/>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Filter;
