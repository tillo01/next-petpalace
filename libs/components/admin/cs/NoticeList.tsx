import React from 'react';
import { useRouter } from 'next/router';
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
	Box,
	IconButton,
	Tooltip,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import { T } from '../../../types/common';
import { FAQ } from '../../../types/faq/faq';
import { userVar } from '../../../../apollo/store';
import { useReactiveVar } from '@apollo/client';
import { NoticeStatus } from '../../../enums/notice.enum';
import OpenInBrowserRoundedIcon from '@mui/icons-material/OpenInBrowserRounded';
import Moment from 'react-moment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { REACT_APP_API_URL } from '../../../config';
import DeleteIcon from '@mui/icons-material/Delete';

interface Data {
	category: string;
	title: string;
	writer: string;
	date: string;
	status: string;
	id?: string;
	view: number;
}

/** Bu adminpage faq-bottom center **/

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
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
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'CATEGORY',
	},
	{
		id: 'category',
		numeric: true,
		disablePadding: false,
		label: 'FAQ_CONTENT',
	},

	{
		id: 'writer',
		numeric: true,
		disablePadding: false,
		label: 'CATEGORY',
	},

	{
		id: 'view',
		numeric: true,
		disablePadding: false,
		label: 'WRITER',
	},
	{
		id: 'view',
		numeric: true,
		disablePadding: false,
		label: 'VIEWS',
	},
	{
		id: 'date',
		numeric: false,
		disablePadding: false,
		label: 'DATE',
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
	const user = useReactiveVar(userVar);
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

interface NoticeiclesPanelListType {
	dense?: boolean;
	membersData?: any;
	questions: FAQ[];
	searchMembers?: any;
	anchorEl?: any;
	handleMenuIconClick?: any;
	handleMenuIconClose?: any;
	generateMentorTypeHandle?: any;
	removeFaqQuestionHandler: any;
	updateQuestionsHandler: any;
}

export const NoticeArticlesPanelList = (props: NoticeiclesPanelListType) => {
	const {
		dense,
		membersData,
		searchMembers,
		questions,
		anchorEl,
		handleMenuIconClick,
		handleMenuIconClose,
		generateMentorTypeHandle,
		removeFaqQuestionHandler,
		updateQuestionsHandler,
	} = props;
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/
	/** HANDLERS **/
	const filetrQuestions = questions.filter((question) => question.noticeCategory === 'NOTICE');

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
					{/*@ts-ignore*/}
					<EnhancedTableHead />
					<TableBody>
						{questions.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={8}>
									<span className={'no-data'}>data not found!</span>
								</TableCell>
							</TableRow>
						)}

						{filetrQuestions.length !== 0 &&
							filetrQuestions.map((question: FAQ, index: number) => (
								<TableRow hover key={question?._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
									<TableCell align="left">{question.noticeCategory}</TableCell>
									<TableCell align="left">
										<Box component={'div'}>
											<Accordion>
												<AccordionSummary expandIcon={<ExpandMoreIcon />}>{question.noticeTitle}</AccordionSummary>
												<AccordionDetails>
													<div dangerouslySetInnerHTML={{ __html: question.noticeContent }} />
												</AccordionDetails>
											</Accordion>
										</Box>
									</TableCell>
									<TableCell align="left">{question.noticeType}</TableCell>
									<TableCell align="left" className={'name'}>
										<Link href={`/member?memberId=${question.memberId}`}>
											<Avatar
												alt="Remy Sharp"
												src={
													user?.memberImage
														? `${REACT_APP_API_URL}/${user?.memberImage}`
														: `/img/profile/defaultUser.svg`
												}
											/>
											{user?.memberNick}
										</Link>
									</TableCell>
									<TableCell align="center">{question?.noticeViews} </TableCell>
									<TableCell align="left">
										<Moment format={'DD.MM.YY HH:mm'}>{question?.createdAt}</Moment>
									</TableCell>
									<TableCell align="center">
										{question.noticeStatus === NoticeStatus.DELETE ? (
											<Button
												variant="outlined"
												sx={{ p: '3px', border: 'none', ':hover': { border: '1px solid #000000' } }}
												onClick={() => removeFaqQuestionHandler(question._id)}
											>
												<DeleteIcon fontSize="small" />
											</Button>
										) : (
											<>
												<Button onClick={(e: any) => handleMenuIconClick(e, index)} className={'badge success'}>
													{question.noticeStatus}
												</Button>

												<Menu
													className={'menu-modal'}
													MenuListProps={{
														'aria-labelledby': 'fade-button',
													}}
													anchorEl={anchorEl[index]}
													open={Boolean(anchorEl[index])}
													onClose={handleMenuIconClose}
													TransitionComponent={Fade}
													sx={{ p: 1 }}
												>
													{Object.values(NoticeStatus)
														.filter((ele) => ele !== question.noticeStatus)
														.map((status: string) => (
															<MenuItem
																onClick={() => updateQuestionsHandler({ _id: question._id, noticeStatus: status })}
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
							))}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
