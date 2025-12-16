import { Router } from "express";
import auth from "../../middlewares/auth";
import metaDataController from "./metaData.controller";

const router =  Router()


router.get("/",auth(),metaDataController.getUserGlobalMetadata)

router.get("/notifications",auth(),metaDataController.getUserNotificationsMetadata)


const metadataRouter = router

export default metadataRouter