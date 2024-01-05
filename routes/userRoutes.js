const express = require("express");
const {
  registerUser,
  loginUser
} = require("../controllers/userController");

const validateToken = require("../middleware/validateTokenHandler");
const {
  getAllCommunities,
  createCommunity,
  getCommunityMembers,
  addCommunityMember,
  removeCommunityMember
} = require("../controllers/communityController");



const router = express.Router();

// Authentication routes
router.post("/user/signup", registerUser);
router.post("/user/login", loginUser);

// Community routes
router.get('/communities',validateToken, getAllCommunities);
router.post('/communities',validateToken, createCommunity);

// Moderation routes
router.get('/communities/:communityId/members',validateToken, getCommunityMembers);
router.post('/communities/:communityId/members', validateToken,addCommunityMember);
router.delete('/communities/:communityId/members/:memberId',validateToken, removeCommunityMember);

module.exports = router;