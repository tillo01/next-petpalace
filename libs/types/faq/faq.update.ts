import { NoticeCategory, NoticeStatus, NoticeType } from '../../enums/notice.enum';

export interface FAQUpdate {
	_id: string;
	noticeCategory?: NoticeCategory;
	noticeStatus?: NoticeStatus;
	noticeType?: NoticeType;
	noticeTitle?: string;
	noticeContent?: string;
	updatedAt?: Date;
	deletedAt?: Date;
}
