import React, { ChangeEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import ReviewCard from '../../libs/components/seller/ReviewCard';
import { Box, Button, Pagination, Stack, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Pet } from '../../libs/types/pet/pet';
import { Member } from '../../libs/types/member/member';
import {
	sweetErrorAlert,
	sweetErrorHandling,
	sweetMixinErrorAlert,
	sweetTopSmallSuccessAlert,
} from '../../libs/sweetAlert';
import { userVar } from '../../apollo/store';
import { PetsInquiry } from '../../libs/types/pet/pet.input';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Messages, REACT_APP_API_URL } from '../../libs/config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { T } from '../../libs/types/common';
import { GET_COMMENTS, GET_MEMBER, GET_PETS } from '../../apollo/user/query';
import { CREATE_COMMENT, LIKE_TARGET_PET } from '../../apollo/user/mutation';
import PetBigCard from '../../libs/components/common/PetBigCard';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const SellerDetail: NextPage = ({ initialInput, initialComment, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [sellerId, setSellerId] = useState<string | null>(null);
	const [seller, setSeller] = useState<Member | null>(null);
	const [searchFilter, setSearchFilter] = useState<PetsInquiry>(initialInput);
	const [sellerPets, setSellerPets] = useState<Pet[]>([]);
	const [petTotal, setPetTotal] = useState<number>(0);
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [sellerComments, setSellerComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.MEMBER,
		commentContent: '',
		commentRefId: '',
	});
	const [likeTargetPet] = useMutation(LIKE_TARGET_PET);
	const [createComment] = useMutation(CREATE_COMMENT);

	/** APOLLO REQUESTS **/

	const {
		loading: getMemberLoading,
		data: getMemberData,
		error: getMemberError,
		refetch: getMemberRefetch,
	} = useQuery(GET_MEMBER, {
		fetchPolicy: 'network-only',
		variables: { input: sellerId },
		skip: !sellerId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setSeller(data?.getMember);
			setSearchFilter({
				...searchFilter,
				search: {
					memberId: data?.getMember?._id,
				},
			});
			setCommentInquiry({
				...commentInquiry,
				search: {
					commentRefId: data?.getMember?._id,
				},
			});
			setInsertCommentData({
				...insertCommentData,
				commentRefId: data?.getMember?._id,
			});
		},
	});

	const {
		loading: getPetsLoading,
		data: getPetsData,
		error: getPetsError,
		refetch: getPetsRefetch,
	} = useQuery(GET_PETS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter.search.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setSellerPets(data?.getPets?.list);
			setPetTotal(data?.getPets?.metaCounter[0]?.total ?? 0);
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'network-only',
		variables: { input: commentInquiry },
		skip: !commentInquiry.search.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setSellerComments(data?.getComments?.list);
			setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
		},
	});

	const createCommentHandler = async () => {
		try {
			if (!user._id) throw new Error(Messages.error2);
			if (user._id === sellerId) throw new Error(Messages.error6);
			console.log('--', insertCommentData);

			const result = await createComment({
				variables: {
					input: insertCommentData,
				},
			});
			console.log('++', result);

			setInsertCommentData({ ...insertCommentData, commentContent: '' });
			await getCommentsRefetch({ input: commentInquiry });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};
	const likePetHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);
			await sweetErrorAlert('Please login first !');

			await likeTargetPet({ variables: { input: id } });

			await getPetsRefetch({ input: searchFilter });
		} catch (err: any) {
			console.log('Erron on likePetHandler', err);
		}
	};

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.sellerId) setSellerId(router.query.sellerId as string);
	}, [router]);

	useEffect(() => {
		if (searchFilter.search.memberId) {
			getPetsRefetch().then();
		}
	}, [searchFilter]);

	useEffect(() => {
		if (commentInquiry.search.commentRefId) {
			getCommentsRefetch().then();
		}
	}, [commentInquiry]);

	/** HANDLERS **/
	const redirectToMemberPageHandler = async (memberId: string) => {
		try {
			if (memberId === user?._id) await router.push(`/mypage?memberId=${memberId}`);
			else await router.push(`/member?memberId=${memberId}`);
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};

	const petPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		setSearchFilter({ ...searchFilter });
	};

	const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		commentInquiry.page = value;
		setCommentInquiry({ ...commentInquiry });
	};

	if (device === 'mobile') {
		return <div>SELLER DETAIL PAGE MOBILE</div>;
	} else {
		return (
			<Stack className={'seller-detail-page'}>
				<Stack className={'container'}>
					<Stack className={'seller-info'}>
						<img
							src={seller?.memberImage ? `${REACT_APP_API_URL}/${seller?.memberImage}` : '/img/profile/defaultUser.svg'}
							alt=""
						/>
						<Box
							component={'div'}
							className={'info'}
							onClick={() => redirectToMemberPageHandler(seller?._id as string)}
						>
							<strong>{seller?.memberFullName ?? seller?.memberNick}</strong>
							<div>
								<img src="/img/icons/call.svg" alt="" />
								<span>{seller?.memberPhone}</span>
							</div>
						</Box>
					</Stack>
					<Stack className={'seller-home-list'}>
						<Stack className={'card-wrap'}>
							{sellerPets.map((pet: Pet) => {
								return (
									<div className={'wrap-main'} key={pet?._id}>
										<PetBigCard pet={pet} key={pet?._id} likePetHandler={likePetHandler} />
									</div>
								);
							})}
						</Stack>
						<Stack className={'pagination'}>
							{petTotal ? (
								<>
									<Stack className="pagination-box">
										<Pagination
											page={searchFilter.page}
											count={Math.ceil(petTotal / searchFilter.limit) || 1}
											onChange={petPaginationChangeHandler}
											shape="circular"
											color="primary"
										/>
									</Stack>
									<span>
										Total {petTotal} pet{petTotal > 1 ? 's' : 't'} available
									</span>
								</>
							) : (
								<div className={'no-data'}>
									<img src="/img/icons/icoAlert.svg" alt="" />
									<p>No pets found!</p>
								</div>
							)}
						</Stack>
					</Stack>

					<Stack className={'review-box'}>
						<Stack className={'main-intro'}>
							<span>Reviews</span>
							<p>We are glad to see you here.</p>
						</Stack>
						<Stack className={'review-box-detail'}>
							<Stack className={'leave-review-config'}>
								<Typography className={'main-title'}>Leave A Review</Typography>
								<Typography className={'review-title'}>Review</Typography>
								<textarea
									onChange={({ target: { value } }: any) => {
										setInsertCommentData({ ...insertCommentData, commentContent: value });
									}}
									value={insertCommentData.commentContent}
								></textarea>
								<Box className={'submit-btn'} component={'div'}>
									<Button
										className={'submit-review'}
										disabled={insertCommentData.commentContent === '' || user?._id === ''}
										onClick={createCommentHandler}
									>
										<Typography className={'title'}>Submit Review</Typography>
										<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
											<g clipPath="url(#clip0_6975_3642)">
												<path
													d="M16.1571 0.5H6.37936C6.1337 0.5 5.93491 0.698792 5.93491 0.944458C5.93491 1.19012 6.1337 1.38892 6.37936 1.38892H15.0842L0.731781 15.7413C0.558156 15.915 0.558156 16.1962 0.731781 16.3698C0.818573 16.4566 0.932323 16.5 1.04603 16.5C1.15974 16.5 1.27345 16.4566 1.36028 16.3698L15.7127 2.01737V10.7222C15.7127 10.9679 15.9115 11.1667 16.1572 11.1667C16.4028 11.1667 16.6016 10.9679 16.6016 10.7222V0.944458C16.6016 0.698792 16.4028 0.5 16.1571 0.5Z"
													fill="#181A20"
												/>
											</g>
											<defs>
												<clipPath id="clip0_6975_3642">
													<rect width="16" height="16" fill="white" transform="translate(0.601562 0.5)" />
												</clipPath>
											</defs>
										</svg>
									</Button>
								</Box>
							</Stack>
							{commentTotal !== 0 && (
								<Stack className={'review-wrap'}>
									<Box component={'div'} className={'title-box'}>
										<StarIcon />
										<span>
											{commentTotal} review{commentTotal > 1 ? 's' : ''}
										</span>
									</Box>
									{sellerComments?.map((comment: Comment) => {
										return <ReviewCard comment={comment} key={comment?._id} />;
									})}
									<Box component={'div'} className={'pagination-box'}>
										<Pagination
											page={commentInquiry.page}
											count={Math.ceil(commentTotal / commentInquiry.limit) || 1}
											onChange={commentPaginationChangeHandler}
											shape="circular"
											color="primary"
										/>
									</Box>
								</Stack>
							)}
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

SellerDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			memberId: '',
		},
	},
	initialComment: {
		page: 1,
		limit: 4,
		sort: 'createdAt',
		direction: 'ASC',
		search: {
			commentRefId: '',
		},
	},
};

export default withLayoutBasic(SellerDetail);
