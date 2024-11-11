import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_SELLERS = gql`
	query GetSellers($input: SellersInquiry!) {
		getSellers(input: $input) {
			list {
				_id
				memberType
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberWarnings
				memberBlocks
				memberPets
				memberRank
				memberPoints
				memberLikes
				memberViews
				deletedAt
				createdAt
				updatedAt
				accessToken
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER = gql(`
 query GetMember($input: String!) {
    getMember(memberId: $input) {
        _id
        memberType
        memberStatus
        memberAuthType
        memberPhone
        memberNick
        memberFullName
        memberImage
        memberAddress
        memberDesc
        memberPets
        memberArticles
        memberPoints
        memberLikes
        memberViews
        memberFollowings
				memberFollowers
        memberRank
        memberWarnings
        memberBlocks
        deletedAt
        createdAt
        updatedAt
        accessToken
        meFollowed {
					followingId
					followerId
					myFollowing
				}
    }
}
`);

/**************************
 *        PET        *
 *************************/

export const GET_PET = gql`
	query GetPet($input: String!) {
		getPet(petId: $input) {
			_id
			petType
			petStatus
			petLocation
			petAddress
			petTitle
			petPrice
			petWeight
			petHeight
			petAges
			petViews
			petLikes
			petComments
			petRank
			petImages
			petDesc
			petSell
			petAdoption
			memberId
			soldAt
			deletedAt
			bornAt
			createdAt
			updatedAt
			memberData {
				_id
				memberType
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberPets
				memberArticles
				memberFollowers
				memberFollowings
				memberPoints
				memberLikes
				memberViews
				memberComments
				memberRank
				memberWarnings
				memberBlocks
				deletedAt
				createdAt
				updatedAt
				accessToken
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const GET_PETS = gql`
	query GetPets($input: PetsInquiry!) {
		getPets(input: $input) {
			list {
				_id
				petType
				petStatus
				petLocation
				petAddress
				petTitle
				petPrice
				petWeight
				petHeight
				petAges
				petViews
				petLikes
				petComments
				petRank
				petImages
				petDesc
				petSell
				petAdoption
				memberId
				soldAt
				deletedAt
				bornAt
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_SELLER_PETS = gql`
	query GetSellerPets($input: SellerPetsInquiry!) {
		getSellerPets(input: $input) {
			list {
				_id
				petType
				petStatus
				petLocation
				petAddress
				petTitle
				petPrice
				petWeight
				petHeight
				petAges
				petViews
				petLikes
				petComments
				petRank
				petImages
				petDesc
				petSell
				petAdoption
				memberId
				soldAt
				deletedAt
				bornAt
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_FAVORITES = gql`
	query GetFavorites($input: OrdinaryInquiry!) {
		getFavorites(input: $input) {
			list {
				_id
				petType
				petStatus
				petLocation
				petAddress
				petTitle
				petPrice
				petWeight
				petHeight
				petAges
				petViews
				petLikes
				petComments
				petRank
				petImages
				petDesc
				petSell
				petAdoption
				memberId
				soldAt
				deletedAt
				bornAt
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_VISITED = gql`
	query GetVisited($input: OrdinaryInquiry!) {
		getVisited(input: $input) {
			list {
				_id
				petType
				petStatus
				petLocation
				petAddress
				petTitle
				petPrice
				petWeight
				petHeight
				petAges
				petViews
				petLikes
				petComments
				petRank
				petImages
				petDesc
				petSell
				petAdoption
				memberId
				soldAt
				deletedAt
				bornAt
				createdAt
				updatedAt
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const GET_BOARD_ARTICLE = gql`
	query GetBoardArticle($input: String!) {
		getBoardArticle(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			articleComments
			memberId
			createdAt
			updatedAt
			memberData {
				_id
				memberType
				memberStatus
				memberAuthType
				memberPhone
				memberNick
				memberFullName
				memberImage
				memberAddress
				memberDesc
				memberWarnings
				memberBlocks
				memberPets
				memberRank
				memberPoints
				memberLikes
				memberViews
				deletedAt
				createdAt
				updatedAt
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const GET_BOARD_ARTICLES = gql`
	query GetBoardArticles($input: BoardArticlesInquiry!) {
		getBoardArticles(input: $input) {
			list {
				_id
				articleCategory
				articleStatus
				articleTitle
				articleContent
				articleImage
				articleViews
				articleLikes
				articleComments
				memberId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberWarnings
					memberBlocks
					memberPets
					memberRank
					memberPoints
					memberLikes
					memberViews
					deletedAt
					createdAt
					updatedAt
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const GET_COMMENTS = gql`
	query GetComments($input: CommentsInquiry!) {
		getComments(input: $input) {
			list {
				_id
				commentStatus
				commentGroup
				commentContent
				commentRefId
				memberId
				createdAt
				updatedAt
				memberData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberWarnings
					memberBlocks
					memberPets
					memberRank
					memberPoints
					memberLikes
					memberViews
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         FOLLOW        *
 *************************/
export const GET_MEMBER_FOLLOWERS = gql`
	query GetMemberFollowers($input: FollowInquiry!) {
		getMemberFollowers(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
				followerData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberPets
					memberArticles
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberFollowings
					memberFollowers
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER_FOLLOWINGS = gql`
	query GetMemberFollowings($input: FollowInquiry!) {
		getMemberFollowings(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				followingData {
					_id
					memberType
					memberStatus
					memberAuthType
					memberPhone
					memberNick
					memberFullName
					memberImage
					memberAddress
					memberDesc
					memberPets
					memberArticles
					memberPoints
					memberLikes
					memberViews
					memberComments
					memberFollowings
					memberFollowers
					memberRank
					memberWarnings
					memberBlocks
					deletedAt
					createdAt
					updatedAt
					accessToken
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_NOTIFICATIONS = gql`
	query GetNotifications($input: NotifInquiry!) {
		getNotifications(input: $input) {
			list {
				_id
				authorId
				receiverId
				petId
				articleId
				notificationType
				notificationStatus
				notificationGroup
				notificationTitle
				notificationDesc
				createdAt
				updatedAt
				authorNick
				petTitle
				articleTitle
				commentContent
				commentRefId
			}
		}
	}
`;

export const GETALL_FAQ_QUESTIONSBYADMIN = gql`
	query GetAllFaqQuestionsByAdmin($input: FAQInquiry!) {
		getAllFaqQuestionsByAdmin(input: $input) {
			list {
				_id
				noticeCategory
				noticeStatus
				noticeType
				noticeViews
				noticeTitle
				noticeContent
				memberId
				createdAt
				deletedAt
				updatedAt
			}
			faqmetaCounter {
				total
			}
		}
	}
`;

export const GET_FAQ_QUESTION = gql`
	query GetFaqQuestion($input: String!) {
		getFaqQuestion(answerId: $input) {
			_id
			noticeCategory
			noticeStatus
			noticeType
			noticeTitle
			noticeViews
			noticeContent
			memberId
			createdAt
			deletedAt
			updatedAt
		}
	}
`;

export const GETALL_FAQ_QUESTIONS = gql`
	query GetAllFaqQuestions($input: FAQInquiry!) {
		getAllFaqQuestions(input: $input) {
			list {
				_id
				noticeCategory
				noticeStatus
				noticeType
				noticeTitle
				noticeViews
				noticeContent
				memberId
				createdAt
				deletedAt
				updatedAt
			}
			faqmetaCounter {
				total
			}
		}
	}
`;
