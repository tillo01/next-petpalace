import { NoticeCategory, NoticeStatus, NoticeType } from '../../enums/notice.enum';

export interface FAQ {
	_id: string;
	noticeCategory: NoticeCategory;
	noticeStatus: NoticeStatus;
	noticeType: NoticeType;
	noticeTitle: string;
	noticeContent: string;
	noticeViews?: number;
	memberId: string;
	createdAt: Date;
	deletedAt?: Date;
	updatedAt?: Date;
}

export interface FAQs {
	list: FAQ[];
	faqmetaCounter: FAQTotalCounter[];
}
export interface FAQTotalCounter {
	total?: number;
}
