const express = require('express');
// Import controller functions
const userController = require('../controllers/userController');
const communityController = require('../controllers/communityController');
const roleController = require('../controllers/roleController');
const memberController = require('../controllers/memberController');
const validateToken = require('../middleware/validateTokenHandler');
const router = express.Router();
// User routes
router.post('/v1/auth/signup', userController.signup);
router.post('/v1/auth/signin', userController.signin);
router.get('/v1/auth/me',validateToken, userController.getMe);

// Community routes
router.post('/v1/community',validateToken, communityController.createCommunity);
router.get('/v1/community', communityController.getAllCommunities);
router.get('/v1/community/:id/members', communityController.getAllCommunityMembers);
router.get('/v1/community/me/owner',validateToken, communityController.getOwnedCommunities);
router.get('/v1/community/me/member',validateToken, communityController.getJoinedCommunities);

// Role routes
router.post('/v1/role', roleController.createRole);
router.get('/v1/role', roleController.getAllRoles);

// // Member routes
router.post('/v1/member',validateToken, memberController.addMember);
router.delete('/v1/member/:id',validateToken, memberController.removeMember);

module.exports = router;
