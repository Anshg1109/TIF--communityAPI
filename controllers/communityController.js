// communityController.js
const Community = require('../models/CommunityModel');
const User = require('../models/userModel');

exports.getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find();
    res.status(200).json(communities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCommunity = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.userId;
    const community = new Community({ name, admin: userId, members: [userId] });
    await community.save();
    res.status(201).json({ message: 'Community created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCommunityMembers = async (req, res) => {
  try {
    const communityId = req.params.communityId;
    const userId = req.userId;
    
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    if (!community.members.includes(userId)) {
      return res.status(400).json({ message: 'User is not a member of the community' });
    }

    const communityMembers = await Community.findById(communityId).populate('members', 'name email');
    res.status(200).json(communityMembers.members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.addCommunityMember = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { userId } = req.body;
    const userIdToAdd = req.userId;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    if (community.admin.toString() !== userIdToAdd) {
      return res.status(403).json({ message: 'Only admin can add members to the community' });
    }

    const userToAdd = await User.findById(userId);
    if (!userToAdd) {
      return res.status(404).json({ message: 'User to be added not found' });
    }

    if (community.members.includes(userToAdd._id)) {
      return res.status(400).json({ message: 'User is already a member of the community' });
    }

    community.members.push(userToAdd._id);
    await community.save();

    res.status(200).json({ message: 'User added to the community' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeCommunityMember = async (req, res) => {
  try {
    const { communityId, memberId } = req.params; 
    const userIdToRemove = req.userId; 

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    if (community.admin.toString() !== userIdToRemove) {
      return res.status(403).json({ message: 'Only admin can remove members from the community' });
    }

    if (!community.members.includes(memberId)) {
      return res.status(400).json({ message: 'Member is not a part of the community' });
    }

    community.members = community.members.filter(member => member.toString() !== memberId);
    await community.save();

    res.status(200).json({ message: 'Member removed from the community' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
