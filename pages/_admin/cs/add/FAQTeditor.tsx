import React, { useMemo, useRef, useState } from 'react';
import { Box, Button, FormControl, MenuItem, Stack, Typography, Select, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';
import '@toast-ui/editor/dist/toastui-editor.css';
import { useMutation } from '@apollo/client';
import { CREATE_BOARD_ARTICLE, CREATE_FAQ_QUESTIONS } from '../../../../apollo/user/mutation';
import { getJwtToken } from '../../../../libs/auth';
import { Editor } from '@toast-ui/react-editor';
import { BoardArticleCategory } from '../../../../libs/enums/board-article.enum';
import { REACT_APP_API_URL } from '../../../../libs/config';
import { T } from '../../../../libs/types/common';
import { Message } from '../../../../libs/enums/common.enum';
import { sweetErrorHandling, sweetTopSuccessAlert } from '../../../../libs/sweetAlert';
import { NoticeCategory, NoticeStatus, NoticeType } from '../../../../libs/enums/notice.enum';

const FAQTeditor = () => {
	const editorRef = useRef<Editor>(null),
		token = getJwtToken(),
		router = useRouter();
	const [noticeCategory, setNoticeCategory] = useState<NoticeCategory>(NoticeCategory.TERMS);
	const [noticeStatus, setNoticeStatus] = useState<NoticeStatus>(NoticeStatus.HOLD);
	const [noticeType, setNoticeType] = useState<NoticeType>(NoticeType.PROPERTY);

	/** APOLLO REQUESTS **/
	const [createFaqQuestions] = useMutation(CREATE_FAQ_QUESTIONS);

	const memoizedValues = useMemo(() => {
		const noticeTitle = '',
			noticeContent = '';

		return { noticeTitle, noticeContent };
	}, []);

	/** HANDLERS **/

	const changeCategoryHandler = (e: any) => {
		setNoticeCategory(e.target.value);
	};
	const changeStatusHandler = (e: any) => {
		setNoticeStatus(e.target.value);
	};
	const changeTypeHandler = (e: any) => {
		setNoticeType(e.target.value);
	};

	const articleTitleHandler = (e: T) => {
		console.log(e.target.value);
		memoizedValues.noticeTitle = e.target.value;
	};

	const doDisabledCheck = () => {
		if (memoizedValues.noticeContent === '' || memoizedValues.noticeTitle === '') {
			return true;
		}
	};
	const handleRegisterButton = async () => {
		try {
			const editor = editorRef.current;
			const noticeContent = editor?.getInstance().getHTML() as string;

			memoizedValues.noticeContent = noticeContent;

			if (memoizedValues.noticeContent === '' || memoizedValues.noticeTitle === '') {
				throw new Error(Message.INSERT_ALL_INPUTS);
			}

			await createFaqQuestions({
				variables: {
					input: { ...memoizedValues, noticeCategory, noticeStatus, noticeType },
				},
			});

			await sweetTopSuccessAlert('FAQ is created successfully', 700);
			await router.push({
				pathname: '/_admin/cs/faq',
				query: {
					category: '/cs?tab=faq',
				},
			});
		} catch (err: any) {
			console.log(err);
			sweetErrorHandling(new Error(Message.INSERT_ALL_INPUTS)).then();
		}
	};

	return (
		<Stack>
			<Stack direction="row" style={{ margin: '40px' }} justifyContent="space-evenly">
				<Box component={'div'} className={'form_row'} style={{ width: '300px' }}>
					<Typography style={{ color: '#7f838d', margin: '10px' }} variant="h3">
						Category
					</Typography>
					<FormControl sx={{ width: '70%', background: 'white' }}>
						<Select
							value={noticeCategory}
							onChange={changeCategoryHandler}
							displayEmpty
							inputProps={{ 'aria-label': 'Without label' }}
						>
							<MenuItem value={NoticeCategory.FAQ}>
								<span>FAQ</span>
							</MenuItem>
							<MenuItem value={NoticeCategory.TERMS}>TERMS</MenuItem>
						</Select>
					</FormControl>
				</Box>

				<Box component={'div'} className={'form_row'} style={{ width: '300px' }}>
					<Typography style={{ color: '#7f838d', margin: '10px' }} variant="h3">
						Status
					</Typography>
					<FormControl sx={{ width: '70%', background: 'white' }}>
						<Select
							value={noticeStatus}
							onChange={changeStatusHandler}
							displayEmpty
							inputProps={{ 'aria-label': 'Without label' }}
						>
							<MenuItem value={NoticeStatus.ACTIVE}>
								<span>ACTIVE</span>
							</MenuItem>
							<MenuItem value={NoticeStatus.HOLD}>HOLD</MenuItem>
						</Select>
					</FormControl>
				</Box>

				<Box component={'div'} className={'form_row'} style={{ width: '300px' }}>
					<Typography style={{ color: '#7f838d', margin: '10px' }} variant="h3">
						Type
					</Typography>
					<FormControl sx={{ width: '70%', background: 'white' }}>
						<Select
							value={noticeType}
							onChange={changeTypeHandler}
							displayEmpty
							inputProps={{ 'aria-label': 'Without label' }}
						>
							<MenuItem value={NoticeType.PROPERTY}>
								<span>PROPERTY</span>
							</MenuItem>
							<MenuItem value={NoticeType.COMMUNITY}>
								<span>COMMUNITY</span>
							</MenuItem>

							<MenuItem value={NoticeType.FORAGENTS}>
								<span>FORAGENTS</span>
							</MenuItem>
							<MenuItem value={NoticeType.FORBUYERS}>
								<span>FORBUYERS</span>
							</MenuItem>
							<MenuItem value={NoticeType.PAYMENT}>
								<span>PAYMENT</span>
							</MenuItem>
							<MenuItem value={NoticeType.OTHER}>
								<span>OTHER</span>
							</MenuItem>
						</Select>
					</FormControl>
				</Box>
				<Box component={'div'} style={{ width: '300px', flexDirection: 'column' }}>
					<Typography style={{ color: '#7f838d', margin: '10px' }} variant="h3">
						Title
					</Typography>
					<TextField
						onChange={articleTitleHandler}
						id="filled-basic"
						label="Type Title"
						style={{ width: '300px', background: 'white' }}
					/>
				</Box>
			</Stack>

			<Editor
				initialValue={'Type here'}
				placeholder={'Type here'}
				previewStyle={'vertical'}
				height={'640px'}
				// @ts-ignore
				initialEditType={'WYSIWYG'}
				toolbarItems={[
					['heading', 'bold', 'italic', 'strike'],
					['image', 'table', 'link'],
					['ul', 'ol', 'task'],
				]}
				ref={editorRef}
				events={{
					load: function (param: any) {},
				}}
			/>

			<Stack direction="row" justifyContent="center">
				<Button
					variant="contained"
					color="primary"
					style={{ margin: '30px', width: '250px', height: '45px' }}
					onClick={handleRegisterButton}
				>
					Register
				</Button>
			</Stack>
		</Stack>
	);
};

export default FAQTeditor;
