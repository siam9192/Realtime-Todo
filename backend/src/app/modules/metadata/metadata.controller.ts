import { paginationOptionPicker } from "../../helpers/pagination.helper";
import catchAsync from "../../lib/catchAsync";
import httpStatus from "../../lib/http-status";
import { sendSuccessResponse } from "../../lib/response";
import metaDataService from "./metaData.service";

class MetadataController {
      getUserGlobalMetadata = catchAsync(async (req, res) => {
    const result = await metaDataService.getUserGlobalMetadata(
      req.user,
    );
    sendSuccessResponse(res, {
      message: 'Metadata retrieved successfully',
      statusCode: httpStatus.OK,
      data:result
    });
  });
      getUserNotificationsMetadata = catchAsync(async (req, res) => {
    const result = await metaDataService.getUserGlobalMetadata(
      req.user,
    );
    sendSuccessResponse(res, {
      message: 'Metadata retrieved successfully',
      statusCode: httpStatus.OK,
      data:result
    });
  });
}
export default new MetadataController()