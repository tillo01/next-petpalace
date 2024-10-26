import { Direction } from '../../enums/common.enum';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';

export interface NotifUpdate {
	_id: string;
	notificationStatus: NotificationStatus;
	updatedAt: Date;
}
