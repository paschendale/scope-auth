import { loginController, authenticateController } from "../controller/auth.controller";
import { createScopeController, deleteScopeController, getAllScopesController, getScopeController } from "../controller/scope.controller";
import { createUserController, deleteUserController, getAllUsersController, getUserController } from "../controller/user.controller";

var express = require('express');
export const router = express.Router();

router.get('/user',getAllUsersController)
router.get('/user/:id', getUserController)
router.post('/user',createUserController)
router.delete('/user/:id', deleteUserController)

router.get('/scope',getAllScopesController)
router.get('/scope/:id', getScopeController)
router.post('/scope',createScopeController)
router.delete('/scope/:id', deleteScopeController)

router.post('/login', loginController)
router.post('/authenticate', authenticateController)