import { Router } from "express";
import multer from "multer";
import userController from "./app/controllers/userController";
import sessionController from "./app/controllers/sessionController";
import fileController from "./app/controllers/fileController";
import meetupController from "./app/controllers/meetupController";
import organizingController from "./app/controllers/organizingController";
import participantController from "./app/controllers/participantController";
import notificationController from "./app/controllers/notificationController";

import multerConfig from "./config/multer";

import authMiddleware from "./app/middlewares/auth";
import checkUpload from "./app/middlewares/uploadFile";

const routes = new Router();
const upload = multer(multerConfig);

routes.get("/teste", (req, res) => {
  return res.json({ message: "teste" });
});

routes.post("/users", userController.store);

routes.post("/session", sessionController.store);
// validando se o usuario está autenticado na aplicação.
routes.use(authMiddleware);

routes.put("/users", userController.update);

routes.post("/upload", upload.single("file"), fileController.store);

routes.get("/meetup", meetupController.index);
routes.post("/meetup", meetupController.store);
routes.put("/meetup/:id", meetupController.update);
routes.delete("/meetup/:id", meetupController.delete);

routes.post("/participant", participantController.store);
routes.get("/participant", participantController.index);

routes.get("/organizing", organizingController.index);

routes.get("/notification", notificationController.index);
routes.put("/notification", notificationController.update);

export default routes;
