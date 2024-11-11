import { Direction } from '../../enums/common.enum';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';

export interface NotifMe {
	_id: string;
	authorId: string;
	receiverId: string;
	petId?: string;
	articleId?: string;
	petTitle?: string;
	articleTitle?: string;
	commentContent: string;
	commentRefId?: string;
	authorNick: string;
	notificationType: NotificationType;
	notificationStatus: NotificationStatus;
	notificationGroup: NotificationGroup;
	notificationTitle: string;
	notificationDesc: string;
	createdAt: Date;
	updatedAt: Date;
}
export interface Noitfies {
	list: NotifMe[];
}

export interface NotifInquiry {
	sort?: string;
	direction: Direction;
	limit: number;
}
