import { loginController, authenticateController } from "../controller/auth.controller";
import { addScopeToUserController, createScopeController, deleteScopeController, getAllScopesController, getScopeController, removeScopeFromUserController } from "../controller/scope.controller";
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
router.post('/scope/add/:id_scope/:id_user',addScopeToUserController)
router.delete('/scope/remove/:id_scope/:id_user',removeScopeFromUserController)

router.post('/login', loginController)
router.post('/authenticate', authenticateController)