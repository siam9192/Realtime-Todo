import { paginationOptionPicker } from '../../helpers/pagination.helper';
import catchAsync from '../../lib/catchAsync';
import httpStatus from '../../lib/http-status';
import { sendSuccessResponse } from '../../lib/response';
import notificationService from './notification.service';

class NotificationController {
  getNotifications = catchAsync(async (req, res) => {
    const result = await notificationService.getUserNotifications(
      req.user,
      paginationOptionPicker(req.query),
    );
    sendSuccessResponse(res, {
      message: 'Notifications retrieved successfully',
      statusCode: httpStatus.OK,
      ...result,
    });
  });
  markUsersNotificationsAsRead = catchAsync(async (req, res) => {
    const result = await notificationService.markUserNotificationsAsRead(
      req.user,
    );
    sendSuccessResponse(res, {
      message: 'Notifications mark as read successfully',
      statusCode: httpStatus.OK,
      data: result,
    });
  });
}

export default new NotificationController();
