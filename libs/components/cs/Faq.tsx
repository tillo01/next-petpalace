import React, { SyntheticEvent, useEffect, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { AccordionDetails, Box, Stack, Typography } from '@mui/material';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { GETALL_FAQ_QUESTIONS } from '../../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { NextPage } from 'next';
import { FAQInquiry } from '../../types/faq/faq.input';
import { FAQ } from '../../types/faq/faq';
import { T } from '../../types/common';
import { NoticeType } from '../../enums/notice.enum';
import { GET_FAQ_QUESTION } from '../../../apollo/user/mutation';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} weight {...props} />)(
	({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
	}),
);
/** Bu userpagedagi faq center **/

const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.4rem' }} />} {...props} />
))(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : '#fff',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(180deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const Faq: NextPage = ({ initialInquiry, ...props }: any) => {
	const [questionsInquiry, setQuestionsInquiry] = useState<FAQInquiry>({ ...initialInquiry });
	const [questions, setQuestions] = useState<FAQ[]>([]);
	const [questionsTotal, setQuestionsTotal] = useState<number>(0);
	const device = useDeviceDetect();
	const router = useRouter();
	const [category, setCategory] = useState<string>('PET');
	const [expanded, setExpanded] = useState<string | false>('panel1');
	const { query } = router;
	const answerId = query?.id as string;
	const [userQuestion, setUserQuestion] = useState<FAQ | null>(null);
	const [value, setValue] = useState(
		questionsInquiry?.search?.noticeType ? questionsInquiry?.search?.noticeType : 'ALL',
	);
	const viewedQuestions = new Set<string>();
	/** APOLLO REQUESTS **/

	const {
		loading: getAllFaqQuestionsByAdminLoading,
		data: getAllFaqQuestionsByAdminData,
		error: getAllFaqQuestionsByAdminError,
		refetch: getAllFaqQuestionsRefetch,
	} = useQuery(GETALL_FAQ_QUESTIONS, {
		fetchPolicy: 'network-only',
		variables: { input: questionsInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setQuestions(data?.getAllFaqQuestions?.list);
			setQuestionsTotal(data?.getAllFaqQuestions?.faqmetaCounter[0]?.total ?? 0);
		},
	});
	const [getFaqQuestion] = useMutation(GET_FAQ_QUESTION);

	/** LIFECYCLES **/

	useEffect(() => {
		setQuestionsInquiry({
			...questionsInquiry,
			page: 1,
			search: { ...questionsInquiry.search },
		});
	}, [questionsInquiry]);

	/** HANDLERS **/
	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);

		setQuestionsInquiry({ ...questionsInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'PET':
				setQuestionsInquiry({ ...questionsInquiry, search: { noticeType: NoticeType.PET } });
				break;
			case 'PAYMENT':
				setQuestionsInquiry({ ...questionsInquiry, search: { noticeType: NoticeType.PAYMENT } });
				break;
			case 'OTHER':
				setQuestionsInquiry({ ...questionsInquiry, search: { noticeType: NoticeType.OTHER } });
				break;
			case 'FORSELLERS':
				setQuestionsInquiry({ ...questionsInquiry, search: { noticeType: NoticeType.FORSELLERS } });
				break;
			case 'FORBUYERS':
				setQuestionsInquiry({ ...questionsInquiry, search: { noticeType: NoticeType.FORBUYERS } });
				break;
			case 'COMMUNITY':
				setQuestionsInquiry({ ...questionsInquiry, search: { noticeType: NoticeType.COMMUNITY } });
				break;
			default:
				delete questionsInquiry?.search?.noticeType;
				setQuestionsInquiry({ ...questionsInquiry });
				break;
		}
	};
	const changeCategoryHandler = (category: string) => {
		setCategory(category);
	};
	const paginationHandler = (e: T, value: number) => {
		setQuestionsInquiry({ ...questionsInquiry, page: value });
	};

	const handleAccordionChange = (answerId: any) => async (event: SyntheticEvent, isExpanded: boolean) => {
		if (isExpanded) {
			setExpanded(answerId);
			if (!viewedQuestions.has(answerId)) {
				viewedQuestions.add(answerId);
				await getFaqQuestion({ variables: { input: answerId } });
				await getAllFaqQuestionsRefetch({ input: questionsInquiry });
			}
		} else {
			setExpanded(false);
		}
	};
	const filetrQuestions = questions.filter((question) => question.noticeCategory === 'FAQ');

	if (device === 'mobile') {
		return <div>FAQ MOBILE</div>;
	} else {
		return (
			<Stack className={'faq-content'}>
				<Box className="categories" component="div">
					{['PET', 'PAYMENT', 'OTHER', 'FORBUYERS', 'FORSELLERS', 'COMMUNITY'].map((tab) => (
						<div key={tab} className={value === tab ? 'active' : ''} onClick={(e: any) => tabChangeHandler(e, tab)}>
							{tab}
						</div>
					))}
				</Box>

				<Box className="wrap" component="div">
					{filetrQuestions.map((question: FAQ) => (
						<Accordion
							key={question._id}
							expanded={expanded === question._id}
							onChange={handleAccordionChange(question._id)}
						>
							<AccordionSummary id={`panel-${question._id}`} aria-controls={`panel-${question._id}-content`}>
								<Typography className="badge" variant="h4">
									Q
								</Typography>
								<Typography>{question.noticeTitle}</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Stack className="answer flex-box">
									<Typography className="badge" variant="h4" color="primary">
										A
									</Typography>
									<Typography>
										{/* Show userQuestion content if it matches the expanded one */}
										{question.noticeContent}
									</Typography>
								</Stack>
							</AccordionDetails>
						</Accordion>
					))}
				</Box>
			</Stack>
		);
	}
};
Faq.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 100,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default Faq;
