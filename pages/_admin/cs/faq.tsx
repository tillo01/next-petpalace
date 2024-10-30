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
import { GETALL_FAQ_QUESTIONSBYADMIN } from '../../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { FAQInquiry } from '../../../libs/types/faq/faq.input';
import { FAQ } from '../../../libs/types/faq/faq';
import { T } from '../../../libs/types/common';
import { REMOVE_FAQ_QUESTIONBYADMIN, UPDATE_FAQ_QUESTIONSBYADMIN } from '../../../apollo/user/mutation';
import { NoticeCategory, NoticeStatus, NoticeType } from '../../../libs/enums/notice.enum';
import { FAQUpdate } from '../../../libs/types/faq/faq.update';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';

/** Bu adminpage faq-top center **/

const FaqArticles: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const router = useRouter();
	const [questionsInquiry, setQuestionsInquiry] = useState<FAQInquiry>(initialInquiry);
	const [questions, setQuestions] = useState<FAQ[]>([]);
	const [questionsTotal, setQuestionsTotal] = useState<number>(0);
	const [value, setValue] = useState(
		questionsInquiry?.search.noticeStatus ? questionsInquiry?.search?.noticeStatus : 'ALL',
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
			case 'DELETE':
				setQuestionsInquiry({ ...questionsInquiry, search: { noticeStatus: NoticeStatus.DELETE } });
				break;
			case 'HOLD':
				setQuestionsInquiry({ ...questionsInquiry, search: { noticeStatus: NoticeStatus.HOLD } });

				break;
			default:
				delete questionsInquiry?.search?.noticeStatus;
				setQuestionsInquiry({ ...questionsInquiry });
				break;
		}
	};

	const textHandler = useCallback((value: string) => {
		try {
			setSearchType(value);
		} catch (err: any) {
			console.log('textHandler: ', err.message);
		}
	}, []);

	const searchTypeHandler = async (newValue: string): Promise<void> => {
		try {
			setSearchType(newValue);
			if (newValue !== 'ALL') {
				setQuestionsInquiry({
					...questionsInquiry,
					page: 1,
					sort: 'createdAt',
					search: {
						...questionsInquiry.search,
						categoryList: newValue as NoticeCategory,
					},
				});
			} else {
				delete questionsInquiry?.search.categoryList;
				setQuestionsInquiry({ ...questionsInquiry });
			}
		} catch (err) {
			console.log('Erron on searchTypeHandler', err);
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
		} catch (err) {
			console.log('Error on updateQuestionsHandler', err);
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
				<Button className="btn_add" variant={'contained'} size={'medium'} onClick={() => router.push(`/_admin/cs/add`)}>
					<AddRoundedIcon sx={{ mr: '8px' }} />
					ADD
				</Button>
			</Box>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={'value'}>
						<Box component={'div'}>
							<List className={'tab-menu'}>
								<ListItem
									onClick={(e: any) => tabChangeHandler(e, 'all')}
									value="all"
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
									Deleted
								</ListItem>
							</List>
							<Divider />
							<Stack className={'search-area'} sx={{ m: '24px' }}>
								<Select sx={{ width: '160px', mr: '20px' }} value={'searchCategory'}>
									<MenuItem value={'mb_nick'}>ALl</MenuItem>
									<MenuItem value={'mb_id'}>ACTIVE</MenuItem>
									<MenuItem value={'mb_id'}>HOLD</MenuItem>
									<MenuItem value={'mb_id'}>HOLD</MenuItem>
								</Select>

								<OutlinedInput
									value={'searchInput'}
									onChange={(e) => textHandler(e.target.value)}
									sx={{ width: '100%' }}
									className={'search'}
									placeholder="Search user name"
									onKeyDown={(event: any) => {
										if (event.key == 'Enter') searchTypeHandler(event.target.value).then();
									}}
									endAdornment={
										<>
											{true && <CancelRoundedIcon onClick={() => {}} />}
											<InputAdornment
												position="end"
												onClick={async () => {
													setSearchText('');
													setQuestionsInquiry({
														...questionsInquiry,
														search: {
															...questionsInquiry,

															text: '',
														},
													});
												}}
											>
												<img src="/img/icons/search_icon.png" alt={'searchIcon'} />
											</InputAdornment>
										</>
									}
								/>
							</Stack>
							<Divider />
						</Box>
						<FaqArticlesPanelList
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
							rowsPerPageOptions={[1, 5, 10, 20, 40, 60]}
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

FaqArticles.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};
export default withAdminLayout(FaqArticles);
