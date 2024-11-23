import React, { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Button, InputAdornment, Stack } from '@mui/material';
import { List, ListItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import OutlinedInput from '@mui/material/OutlinedInput';
import TablePagination from '@mui/material/TablePagination';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { FaqArticlesPanelList } from '../../../libs/components/admin/cs/FaqList';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { FAQInquiry } from '../../../libs/types/faq/faq.input';
import { FAQ } from '../../../libs/types/faq/faq';
import { T } from '../../../libs/types/common';
import { REMOVE_FAQ_QUESTIONBYADMIN, UPDATE_FAQ_QUESTIONSBYADMIN } from '../../../apollo/user/mutation';
import { NoticeCategory, NoticeStatus, NoticeType } from '../../../libs/enums/notice.enum';
import { FAQUpdate } from '../../../libs/types/faq/faq.update';
import { sweetConfirmAlert, sweetErrorHandling, sweetTopSuccessAlert } from '../../../libs/sweetAlert';
import { NoticeArticlesPanelList } from '../../../libs/components/admin/cs/NoticeList';
import { GETALL_FAQ_QUESTIONSBYADMIN } from '../../../apollo/admin/query';

/** Bu adminpage faq-top center **/

const AdminNotice: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const router = useRouter();
	const [questionsInquiry, setQuestionsInquiry] = useState<FAQInquiry>(initialInquiry);
	const [questions, setQuestions] = useState<FAQ[]>([]);
	const [questionsTotal, setQuestionsTotal] = useState<number>(0);
	const [value, setValue] = useState(
		questionsInquiry?.search?.noticeStatus ? questionsInquiry?.search?.noticeStatus : 'ALL',
	);
	const [searchText, setSearchText] = useState('');
	const [searchType, setSearchType] = useState('ALL');
	const [updateFaqsQuestionsByAdmin] = useMutation(UPDATE_FAQ_QUESTIONSBYADMIN);
	const [removeQuestionsByAdmin] = useMutation(REMOVE_FAQ_QUESTIONBYADMIN);

	/** APOLLO REQUESTS **/
	const {
		loading: getAllFaqQuestionsByAdminLoading,
		data: getAllFaqQuestionsByAdminData,
		error: getAllFaqQuestionsByAdminError,
		refetch: getAllFaqQuestionsByAdminRefetch,
	} = useQuery(GETALL_FAQ_QUESTIONSBYADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: questionsInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setQuestions(data?.getAllFaqQuestionsByAdmin?.list);
			setQuestionsTotal(data?.getAllFaqQuestionsByAdmin?.faqmetaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/

	useEffect(() => {
		getAllFaqQuestionsByAdminRefetch({
			input: questionsInquiry,
		}).then();
	}, [questionsInquiry]);

	/** HANDLERS **/

	const changePagehandler = async (event: unknown, newPage: number) => {
		questionsInquiry.page = newPage + 1;
		getAllFaqQuestionsByAdminRefetch({
			input: questionsInquiry,
		});
		setQuestionsInquiry({ ...questionsInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		questionsInquiry.limit = parseInt(event.target.value, 10);
		questionsInquiry.page = 1;
		getAllFaqQuestionsByAdminRefetch({
			input: questionsInquiry,
		});
		setQuestionsInquiry({ ...questionsInquiry });
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

		setQuestionsInquiry({ ...questionsInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setQuestionsInquiry({ ...questionsInquiry, search: { noticeStatus: NoticeStatus.ACTIVE } });
				break;
			case 'HOLD':
				setQuestionsInquiry({ ...questionsInquiry, search: { noticeStatus: NoticeStatus.HOLD } });
				break;
			case 'DELETE':
				setQuestionsInquiry({ ...questionsInquiry, search: { noticeStatus: NoticeStatus.DELETE } });
				break;
			default:
				delete questionsInquiry?.search?.noticeStatus;
				setQuestionsInquiry({ ...questionsInquiry });
				break;
		}
	};
	const updateQuestionsHandler = async (updateData: FAQUpdate) => {
		try {
			console.log('+updateData', updateData);
			await updateFaqsQuestionsByAdmin({
				variables: {
					input: updateData,
				},
			});
			menuIconCloseHandler();
			getAllFaqQuestionsByAdminRefetch({
				input: questionsInquiry,
			});
			sweetTopSuccessAlert('Success');
		} catch (err) {
			console.log('Error on updateQuestionsHandler', err);
			sweetErrorHandling(err).then();
		}
	};

	const textHandler = useCallback((value: string) => {
		try {
			setSearchText(value);
		} catch (err: any) {
			console.log('textHandler: ', err.message);
		}
	}, []);

	const searchTypeHandler = async (newValue: string) => {
		try {
			setSearchType(newValue);
			if (newValue !== 'ALL') {
				setQuestionsInquiry({
					...questionsInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...questionsInquiry.search,
						noticeType: newValue as NoticeType,
					},
				});
			} else {
				delete questionsInquiry?.search.noticeType;
				setQuestionsInquiry({ ...questionsInquiry });
			}
		} catch (err) {
			console.log('Erron on searchTypeHandler', err);
		}
	};

	const searchTextHandler = () => {
		try {
			setQuestionsInquiry({
				...questionsInquiry,
				search: {
					...questionsInquiry.search,
					text: searchText,
				},
			});
		} catch (err: any) {
			console.log('searchTextHandler: ', err.message);
		}
	};

	const removeFaqQuestionHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to delete question')) {
				await removeQuestionsByAdmin({
					variables: {
						input: id,
					},
				});
			}
			getAllFaqQuestionsByAdminRefetch({
				input: questionsInquiry,
			});
		} catch (err) {
			console.log('Error on removeFaqQuestion ', err);
			sweetErrorHandling(err).then();
		}
	};

	return (
		// @ts-ignore
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Typography variant={'h2'}>FAQ Management</Typography>
				<Button
					className="btn_add"
					variant={'contained'}
					size={'medium'}
					color="success"
					onClick={() => router.push(`/_admin/cs/add`)}
				>
					<AddRoundedIcon sx={{ mr: '8px' }} />
					ADD
				</Button>
			</Box>
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
									onClick={(e: any) => tabChangeHandler(e, 'HOLD')}
									value="HOLD"
									className={value === 'HOLD' ? 'li on' : 'li'}
								>
									Hold
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
									<MenuItem value={'PET'} onClick={() => searchTypeHandler('PET')}>
										PET
									</MenuItem>
									<MenuItem value={'FORBUYERS'} onClick={() => searchTypeHandler('FORBUYERS')}>
										FORBUYERS
									</MenuItem>
									<MenuItem value={'PAYMENT'} onClick={() => searchTypeHandler('PAYMENT')}>
										PAYMENT
									</MenuItem>
									<MenuItem value={'FORSELLERS'} onClick={() => searchTypeHandler('FORSELLERS')}>
										FORSELLERS
									</MenuItem>
									<MenuItem value={'COMMUNITY'} onClick={() => searchTypeHandler('COMMUNITY')}>
										COMMUNITY
									</MenuItem>
									<MenuItem value={'OTHER'} onClick={() => searchTypeHandler('OTHER')}>
										OTHER
									</MenuItem>
								</Select>

								<OutlinedInput
									value={searchText}
									onChange={(e: any) => textHandler(e.target.value)}
									sx={{ width: '100%' }}
									className={'search'}
									placeholder="Search questions title"
									onKeyDown={(event: any) => {
										if (event.key == 'Enter') searchTextHandler();
									}}
									endAdornment={
										<>
											{searchText && (
												<CancelRoundedIcon
													style={{ cursor: 'pointer' }}
													onClick={async () => {
														setSearchText('');
														setQuestionsInquiry({
															...questionsInquiry,
															search: {
																...questionsInquiry.search,
																text: '',
															},
														});
														await getAllFaqQuestionsByAdminRefetch({ input: questionsInquiry });
													}}
												/>
											)}
											<InputAdornment onClick={() => searchTextHandler()} position="end">
												<img src="/img/icons/search_icon.png" alt="searchIcon" />
											</InputAdornment>
										</>
									}
								/>
							</Stack>
							<Divider />
						</Box>
						<NoticeArticlesPanelList
							// dense={dense}
							// membersData={membersData}
							// searchMembers={searchMembers}
							anchorEl={anchorEl}
							handleMenuIconClick={menuIconClickHandler}
							handleMenuIconClose={menuIconCloseHandler}
							removeFaqQuestionHandler={removeFaqQuestionHandler}
							updateQuestionsHandler={updateQuestionsHandler}
							questions={questions}
							// generateMentorTypeHandle={generateMentorTypeHandle}
						/>

						<TablePagination
							rowsPerPageOptions={[3, 5, 10, 20, 40, 60]}
							component="div"
							count={questionsTotal}
							rowsPerPage={questionsInquiry?.limit}
							page={questionsInquiry?.page - 1}
							onPageChange={changePagehandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminNotice.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};
export default withAdminLayout(AdminNotice);
