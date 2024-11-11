import React from 'react';
import Link from 'next/link';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { Stack } from '@mui/material';
import { Pet } from '../../../types/pet/pet';
import { REACT_APP_API_URL } from '../../../config';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { PetStatus } from '../../../enums/pet.enum';

interface Data {
	id: string;
	title: string;
	price: string;
	seller: string;
	location: string;
	type: string;
	status: string;
}

type Order = 'asc' | 'desc';

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id',
		numeric: true,
		disablePadding: false,
		label: 'MB ID',
	},
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'TITLE',
	},
	{
		id: 'price',
		numeric: false,
		disablePadding: false,
		label: 'PRICE',
	},
	{
		id: 'seller',
		numeric: false,
		disablePadding: false,
		label: 'SELLER',
	},
	{
		id: 'location',
		numeric: false,
		disablePadding: false,
		label: 'LOCATION',
	},
	{
		id: 'type',
		numeric: false,
		disablePadding: false,
		label: 'TYPE',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'STATUS',
	},
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, pet: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { onSelectAllClick } = props;

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface PetPanelListType {
	pets: Pet[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updatePetHandler: any;
	removePetHandler: any;
}

export const PetPanelList = (props: PetPanelListType) => {
	const { pets, anchorEl, menuIconClickHandler, menuIconCloseHandler, updatePetHandler, removePetHandler } = props;

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					{/*@ts-ignore*/}
					<EnhancedTableHead />
					<TableBody>
						{pets.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={8}>
									<span className={'no-data'}>data not found!</span>
								</TableCell>
							</TableRow>
						)}

						{pets.length !== 0 &&
							pets.map((pet: Pet, index: number) => {
								const petImage = `${REACT_APP_API_URL}/${pet?.petImages[0]}`;

								return (
									<TableRow hover key={pet?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
										<TableCell align="left">{pet._id}</TableCell>
										<TableCell align="left" className={'name'}>
											{pet.petStatus === PetStatus.ACTIVE ? (
												<Stack direction={'row'}>
													<Link href={`/pet/detail?id=${pet?._id}`}>
														<div>
															<Avatar alt="Remy Sharp" src={petImage} sx={{ ml: '2px', mr: '10px' }} />
														</div>
													</Link>
													<Link href={`/pet/detail?id=${pet?._id}`}>
														<div>{pet.petTitle}</div>
													</Link>
												</Stack>
											) : (
												<Stack direction={'row'}>
													<div>
														<Avatar alt="Remy Sharp" src={petImage} sx={{ ml: '2px', mr: '10px' }} />
													</div>
													<div style={{ marginTop: '10px' }}>{pet.petTitle}</div>
												</Stack>
											)}
										</TableCell>
										<TableCell align="center">{pet.petPrice}</TableCell>
										<TableCell align="center">{pet.memberData?.memberNick}</TableCell>
										<TableCell align="center">{pet.petLocation}</TableCell>
										<TableCell align="center">{pet.petType}</TableCell>
										<TableCell align="center">
											{pet.petStatus === PetStatus.DELETED && (
												<Button
													variant="outlined"
													sx={{ p: '3px', border: 'none', ':hover': { border: '1px solid #000000' } }}
													onClick={() => removePetHandler(pet._id)}
												>
													<DeleteIcon fontSize="small" />
												</Button>
											)}

											{pet.petStatus === PetStatus.SOLD && <Button className={'badge warning'}>{pet.petStatus}</Button>}

											{pet.petStatus === PetStatus.ACTIVE && (
												<>
													<Button onClick={(e: any) => menuIconClickHandler(e, index)} className={'badge success'}>
														{pet.petStatus}
													</Button>

													<Menu
														className={'menu-modal'}
														MenuListProps={{
															'aria-labelledby': 'fade-button',
														}}
														anchorEl={anchorEl[index]}
														open={Boolean(anchorEl[index])}
														onClose={menuIconCloseHandler}
														TransitionComponent={Fade}
														sx={{ p: 1 }}
													>
														{Object.values(PetStatus)
															.filter((ele) => ele !== pet.petStatus)
															.map((status: string) => (
																<MenuItem
																	onClick={() => updatePetHandler({ _id: pet._id, petStatus: status })}
																	key={status}
																>
																	<Typography variant={'subtitle1'} component={'span'}>
																		{status}
																	</Typography>
																</MenuItem>
															))}
													</Menu>
												</>
											)}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
