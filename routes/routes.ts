import { loginController, validateTokenController } from "../controller/auth.controller";
import { createUserController, deleteUserController, getAllUsersController, getUserController } from "../controller/user.controller";

var express = require('express');
export const router = express.Router();

router.get('/user',getAllUsersController)
router.get('/user/:id', getUserController)
router.post('/user',createUserController)
router.delete('/user/:id', deleteUserController)

router.post('/login', loginController)
router.post('/validate', validateTokenController)