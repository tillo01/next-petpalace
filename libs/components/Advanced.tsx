import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Stack, Box, Modal, Divider, Button, OutlinedInput } from '@mui/material';
import useDeviceDetect from '../hooks/useDeviceDetect';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { petWeight, petYears } from '../config';
import { PetLocation, PetType } from '../enums/pet.enum';
import { PetsInquiry } from '../types/pet/pet.input';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 'auto',
	bgcolor: 'background.paper',
	borderRadius: '12px',
	outline: 'none',
	boxShadow: 24,
};

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
		sx: {
			'& .MuiMenuItem-root': {
				'&.Mui-selected': {
					backgroundColor: 'transparent',
					'&:hover': {
						backgroundColor: '#7ed957',
					},
				},
				'&:hover': {
					backgroundColor: '#f5f5f5',
				},
			},
		},
	},
};

const thisYear = new Date().getFullYear();

interface HeaderFilterProps {
	initialInput: PetsInquiry;
}

const Advanced = (props: HeaderFilterProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const { t, i18n } = useTranslation('common');
	const [searchFilter, setSearchFilter] = useState<PetsInquiry>(initialInput);
	const locationRef: any = useRef();
	const typeRef: any = useRef();
	const heightsRef: any = useRef();
	const router = useRouter();
	const [openAdvancedFilter, setOpenAdvancedFilter] = useState(false);
	const [openLocation, setOpenLocation] = useState(false);
	const [openType, setOpenType] = useState(false);
	const [openHeights, setOpenHeights] = useState(false);
	const [petLocation, setPetLocation] = useState<PetLocation[]>(Object.values(PetLocation));
	const [petType, setPetType] = useState<PetType[]>(Object.values(PetType));
	const [yearCheck, setYearCheck] = useState({ start: 1990, end: thisYear });
	const [optionCheck, setOptionCheck] = useState('all');

	/** LIFECYCLES **/
	useEffect(() => {
		const clickHandler = (event: MouseEvent) => {
			if (!locationRef?.current?.contains(event.target)) {
				setOpenLocation(false);
			}

			if (!typeRef?.current?.contains(event.target)) {
				setOpenType(false);
			}

			if (!heightsRef?.current?.contains(event.target)) {
				setOpenHeights(false);
			}
		};

		document.addEventListener('mousedown', clickHandler);

		return () => {
			document.removeEventListener('mousedown', clickHandler);
		};
	}, []);

	/** HANDLERS **/

	const [open, setOpen] = React.useState(false);

	const toggleDrawer = (newOpen: boolean) => () => {
		setOpen(newOpen);
	};

	const advancedFilterHandler = (status: boolean) => {
		setOpenLocation(false);
		setOpenHeights(false);
		setOpenType(false);
		setOpenAdvancedFilter(status);
	};

	const locationStateChangeHandler = () => {
		setOpenLocation((prev) => !prev);
		setOpenHeights(false);
		setOpenType(false);
	};

	const typeStateChangeHandler = () => {
		setOpenType((prev) => !prev);
		setOpenLocation(false);
		setOpenHeights(false);
	};

	const heightStateChangeHandler = () => {
		setOpenHeights((prev) => !prev);
		setOpenType(false);
		setOpenLocation(false);
	};

	const disableAllStateHandler = () => {
		setOpenHeights(false);
		setOpenType(false);
		setOpenLocation(false);
	};

	const petAgeSelectHandler = useCallback(
		async (number: Number) => {
			try {
				if (number != 0) {
					if (searchFilter?.search?.agesList?.includes(number)) {
						setSearchFilter({
							...searchFilter,
							search: {
								...searchFilter.search,
								agesList: searchFilter?.search?.agesList?.filter((item: Number) => item !== number),
							},
						});
					} else {
						setSearchFilter({
							...searchFilter,
							search: { ...searchFilter.search, agesList: [...(searchFilter?.search?.agesList || []), number] },
						});
					}
				} else {
					delete searchFilter?.search.agesList;
					setSearchFilter({ ...searchFilter });
				}

				console.log('petAgeSelectHandler:', number);
			} catch (err: any) {
				console.log('ERROR, petAgeSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const petOptionSelectHandler = useCallback(
		async (e: any) => {
			try {
				const value = e.target.value;
				setOptionCheck(value);

				if (value !== 'all') {
					setSearchFilter({
						...searchFilter,
						search: {
							...searchFilter.search,
							options: [value],
						},
					});
				} else {
					delete searchFilter.search.options;
					setSearchFilter({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					});
				}
			} catch (err: any) {
				console.log('ERROR, petOptionSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const petWeightHandler = useCallback(
		async (e: any, type: string) => {
			const value = e.target.value;

			if (type == 'start') {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						// @ts-ignore
						weightRange: { ...searchFilter.search.weightRange, start: parseInt(value) },
					},
				});
			} else {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						// @ts-ignore
						weightRange: { ...searchFilter.search.weightRange, end: parseInt(value) },
					},
				});
			}
		},
		[searchFilter],
	);

	const yearStartChangeHandler = async (event: any) => {
		setYearCheck({ ...yearCheck, start: Number(event.target.value) });

		setSearchFilter({
			...searchFilter,
			search: {
				...searchFilter.search,
				periodsRange: { start: Number(event.target.value), end: yearCheck.end },
			},
		});
	};

	const yearEndChangeHandler = async (event: any) => {
		setYearCheck({ ...yearCheck, end: Number(event.target.value) });

		setSearchFilter({
			...searchFilter,
			search: {
				...searchFilter.search,
				periodsRange: { start: yearCheck.start, end: Number(event.target.value) },
			},
		});
	};

	const resetFilterHandler = () => {
		setSearchFilter(initialInput);
		setOptionCheck('all');
		setYearCheck({ start: 1970, end: thisYear });
	};

	const pushSearchHandler = async () => {
		try {
			if (searchFilter?.search?.locationList?.length == 0) {
				delete searchFilter.search.locationList;
			}

			if (searchFilter?.search?.typeList?.length == 0) {
				delete searchFilter.search.typeList;
			}

			if (searchFilter?.search?.agesList?.length == 0) {
				delete searchFilter.search.agesList;
			}

			if (searchFilter?.search?.options?.length == 0) {
				delete searchFilter.search.options;
			}

			if (searchFilter?.search?.agesList?.length == 0) {
				delete searchFilter.search.agesList;
			}

			await router.push(`/pet?input=${JSON.stringify(searchFilter)}`, `/pet?input=${JSON.stringify(searchFilter)}`);
		} catch (err: any) {
			console.log('ERROR, pushSearchHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>HEADER FILTER MOBILE</div>;
	} else {
		return (
			<>
				{/* ADVANCED */}
				<Stack className={'search-box-other'}>
					<Box className={'advanced-filter'} onClick={() => advancedFilterHandler(true)}>
						<img src="/img/icons/tune.svg" alt="" />
						<span>{t('Search')}</span>
					</Box>
				</Stack>

				{/*MENU */}

				{/* ADVANCED FILTER MODAL */}
				<Modal
					open={openAdvancedFilter}
					onClose={() => advancedFilterHandler(false)}
					aria-labelledby="modal-modal-title"
					aria-descriageby="modal-modal-description"
				>
					{/* @ts-ignore */}
					<Box sx={style}>
						<Box className={'advanced-filter-modal'}>
							<div className={'close'} onClick={() => advancedFilterHandler(false)}>
								<CloseIcon />
							</div>
							<div className={'top'}>
								<span>Effortless Pet Search</span>
								<div className={'search-input-box'}>
									<img src="/img/icons/search.svg" alt="" />
									<input
										value={searchFilter?.search?.text ?? ''}
										type="text"
										placeholder={'What are you looking for?'}
										onChange={(e: any) => {
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: e.target.value },
											});
										}}
									/>
								</div>
							</div>
							<Divider sx={{ mt: '30px', mb: '35px' }} />
							<div className={'middle'}>
								<div className={'row-box'}>
									<div className={'box'}>
										<span>Ages</span>
										<div className={'inside'}>
											<div
												className={`height ${!searchFilter?.search?.agesList ? 'active' : ''}`}
												onClick={() => petAgeSelectHandler(0)}
											>
												Any
											</div>
											{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((age: number) => (
												<div
													className={`height ${searchFilter?.search?.agesList?.includes(age) ? 'active' : ''}`}
													onClick={() => petAgeSelectHandler(age)}
													key={age}
												>
													{age == 0 ? 'Any' : age}
												</div>
											))}
										</div>
									</div>
									<div className={'box'}>
										<span>Options</span>
										<div className={'inside'}>
											<FormControl
												variant="outlined"
												sx={{
													'& .MuiOutlinedInput-root': {
														'& fieldset': {
															borderColor: '#7ed957',
														},
														'&:hover fieldset': {
															borderColor: '#7ed957',
														},
														'&.Mui-focused fieldset': {
															borderColor: '#7ed957',
														},
													},
												}}
											>
												<Select
													value={optionCheck}
													onChange={petOptionSelectHandler}
													displayEmpty
													input={<OutlinedInput />}
													inputProps={{ 'aria-label': 'Without label' }}
												>
													<MenuItem value={'all'}>All Options</MenuItem>
													<MenuItem value={'petSell'}>Buy</MenuItem>
													<MenuItem value={'petAdoption'}>Adoption</MenuItem>
												</Select>
											</FormControl>
										</div>
									</div>
								</div>
								<div className={'row-box'} style={{ marginTop: '44px' }}>
									<div className={'box'}>
										<span>Year Born</span>
										<div className={'inside space-between align-center'}>
											<FormControl
												variant="outlined"
												sx={{
													'& .MuiOutlinedInput-root': {
														'& fieldset': {
															borderColor: '#7ed957',
														},
														'&:hover fieldset': {
															borderColor: '#7ed957',
														},
														'&.Mui-focused fieldset': {
															borderColor: '#7ed957',
														},
													},
													width: '122px',
												}}
											>
												<Select
													value={yearCheck.start.toString()}
													onChange={yearStartChangeHandler}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{petYears?.slice(0)?.map((year: number) => (
														<MenuItem value={year} disabled={yearCheck.end <= year} key={year}>
															{year}
														</MenuItem>
													))}
												</Select>
											</FormControl>
											<div className={'minus-line'}></div>
											<FormControl
												variant="outlined"
												sx={{
													'& .MuiOutlinedInput-root': {
														'& fieldset': {
															borderColor: '#7ed957',
														},
														'&:hover fieldset': {
															borderColor: '#7ed957',
														},
														'&.Mui-focused fieldset': {
															borderColor: '#7ed957',
														},
													},
													width: '122px',
												}}
											>
												<Select
													value={yearCheck.end.toString()}
													onChange={yearEndChangeHandler}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{petYears
														?.slice(0)
														.reverse()
														.map((year: number) => (
															<MenuItem value={year} disabled={yearCheck.start >= year} key={year}>
																{year}
															</MenuItem>
														))}
												</Select>
											</FormControl>
										</div>
									</div>
									<div className={'box'}>
										<span>Weight</span>
										<div className={'inside space-between align-center'}>
											<FormControl
												variant="outlined"
												sx={{
													'& .MuiOutlinedInput-root': {
														'& fieldset': {
															borderColor: '#7ed957',
														},
														'&:hover fieldset': {
															borderColor: '#7ed957',
														},
														'&.Mui-focused fieldset': {
															borderColor: '#7ed957',
														},
													},
													width: '122px',
												}}
											>
												<Select
													value={searchFilter?.search?.weightRange?.start}
													onChange={(e: any) => petWeightHandler(e, 'start')}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{petWeight
														.filter((weight) => weight <= 11.5)
														.map((weight) => (
															<MenuItem value={weight} key={weight}>
																{weight}
															</MenuItem>
														))}
												</Select>
											</FormControl>
											<div className={'minus-line'}></div>
											<FormControl
												variant="outlined"
												sx={{
													'& .MuiOutlinedInput-root': {
														'& fieldset': {
															borderColor: '#7ed957',
														},
														'&:hover fieldset': {
															borderColor: '#7ed957',
														},
														'&.Mui-focused fieldset': {
															borderColor: '#7ed957',
														},
													},
													width: '122px',
												}}
											>
												<Select
													value={searchFilter?.search?.weightRange?.end}
													onChange={(e: any) => petWeightHandler(e, 'end')}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													MenuProps={MenuProps}
												>
													{petWeight
														.filter((weight) => weight > 11.5)
														.map((weight) => (
															<MenuItem value={weight} key={weight}>
																{weight}
															</MenuItem>
														))}
												</Select>
											</FormControl>
										</div>
									</div>
								</div>
							</div>
							<Divider sx={{ mt: '60px', mb: '18px' }} />
							<div className={'bottom'}>
								<div onClick={resetFilterHandler}>
									<img src="/img/icons/reset.svg" alt="" />
									<span>Reset all filters</span>
								</div>
								<Button
									startIcon={<img src={'/img/icons/search.svg'} />}
									className={'search-btn'}
									onClick={pushSearchHandler}
								>
									Search
								</Button>
							</div>
						</Box>
					</Box>
				</Modal>
			</>
		);
	}
};

Advanced.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			weightRange: {
				start: 0,
				end: 23,
			},
			pricesRange: {
				start: 0,
				end: 3000000,
			},
		},
	},
};

export default Advanced;
