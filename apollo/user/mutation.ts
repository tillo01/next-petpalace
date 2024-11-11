import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const SIGN_UP = gql`
	mutation Signup($input: MemberInput!) {
		signup(input: $input) {
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
			memberArticles
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const LOGIN = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
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
`;

export const UPDATE_MEMBER = gql`
	mutation UpdateMember($input: MemberUpdate!) {
		updateMember(input: $input) {
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
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const LIKE_TARGET_MEMBER = gql`
	mutation LikeTargetMember($input: String!) {
		likeTargetMember(memberId: $input) {
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
`;

/**************************
 *        PET        *
 *************************/

export const CREATE_PET = gql`
	mutation CreatePet($input: PetInput!) {
		createPet(input: $input) {
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

export const UPDATE_PET = gql`
	mutation UpdatePet($input: PetUpdate!) {
		updatePet(input: $input) {
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

export const LIKE_TARGET_PET = gql`
	mutation LikeTargetPet($input: String!) {
		likeTargetPet(petId: $input) {
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
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const CREATE_BOARD_ARTICLE = gql`
	mutation CreateBoardArticle($input: BoardArticleInput!) {
		createBoardArticle(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_BOARD_ARTICLE = gql`
	mutation UpdateBoardArticle($input: BoardArticleUpdate!) {
		updateBoardArticle(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const LIKE_TARGET_BOARD_ARTICLE = gql`
	mutation LikeTargetBoardArticle($input: String!) {
		likeTargetBoardArticle(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const CREATE_COMMENT = gql`
	mutation CreateComment($input: CommentInput!) {
		createComment(input: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_COMMENT = gql`
	mutation UpdateComment($input: CommentUpdate!) {
		updateComment(input: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         FOLLOW        *
 *************************/

export const SUBSCRIBE = gql`
	mutation Subscribe($input: String!) {
		subscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;

export const UNSUBSCRIBE = gql`
	mutation Unsubscribe($input: String!) {
		unsubscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;
export const UPDATE_NOTIFICATIONS = gql`
	mutation UpdateNotifications($input: NotifUpdate!) {
		updateNotifications(input: $input) {
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
		}
	}
`;

export const CREATE_FAQ_QUESTIONS = gql`
	mutation CreateFaqQuestions($input: FAQsInput!) {
		createFaqQuestions(input: $input) {
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
	}
`;

export const UPDATE_FAQ_QUESTIONSBYADMIN = gql`
	mutation UpdateFaqsQuestionsByAdmin($input: FAQUpdate!) {
		updateFaqsQuestionsByAdmin(input: $input) {
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
	}
`;

export const REMOVE_FAQ_QUESTIONBYADMIN = gql`
	mutation RemoveQuestionsByAdmin($input: String!) {
		removeQuestionsByAdmin(questionId: $input) {
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
