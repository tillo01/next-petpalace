import { Direction } from '../../enums/common.enum';
import { NoticeCategory, NoticeStatus, NoticeType } from '../../enums/notice.enum';

export interface FAQsInput {
	noticeCategory: NoticeCategory;
	noticeStatus?: NoticeStatus;
	noticeType?: NoticeType;
	noticeTitle: string;
	noticeContent: string;
	memberId?: string;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date;
}

export interface FAQSearch {
	memberId?: string;
	categoryList?: NoticeCategory;
	noticeType?: NoticeType;
	noticeStatus?: NoticeStatus;
	perPageList?: Number[];
	text?: string;
}

export interface FAQInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: FAQSearch;
}
