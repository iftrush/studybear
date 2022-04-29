const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { db } = require("../models/User");

// it is very important to remember your await statements

// UPDATE USER
router.put("/:id", async (req, res) => {
  // :id syntax is a request parameter (i.e. can take on any value)
  if (req.body.userId == req.params.id) {
    // if the request body contains the same id as the user page (req.params)
    if (req.body.password) {
      // generate the new encrypted password
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        console.log(err);
      }
    }
    try {
      await User.findByIdAndUpdate(req.body.userId, {
        $set: req.body, // sets all fields to be the one found in req.body
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      console.log(err);
    }
  } else {
    return res.status(403).json("No permissions");
  }
});

// DELETE USER
router.delete("/:id", async (req, res) => {
  if (req.body.userId == req.params.id) {
    try {
      await User.findByIdAndDelete(req.body.userId);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      console.log(err);
    }
  } else {
    return res.status(403).json("No permissions");
  }
});

// GET USER BY EITHER ID OR USERNAME USING QUERY PARAMETER
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc; // _doc carries the entire document object in MongoDB. need to remove password and other extranneous information from the get response.
    res.status(200).json(other);
  } catch (err) {
    res.status(404).json(err);
  }
});

// GET FOLLOWING/FRIENDS
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.following.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendsList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend; // only unpack the properties we need
      friendsList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendsList);
  } catch (err) {
    console.log(err);
  }
});

// FOLLOW USER
router.put("/:id/follow", async (req, res) => {
  // if not attempting to follow self
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      // if not already following
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } }); // update both users involved using $push syntax
        await currentUser.updateOne({ $push: { following: req.params.id } }); // update both users involved
        res.status(200).json("Followed user");
      } else {
        res.status(403).json("Already following");
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.status(403).json("Can't follow self");
  }
});

// UNFOLLOW USER
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } }); // update both users involved using $pull syntax
        await currentUser.updateOne({ $pull: { following: req.params.id } }); // update both users involved
        res.status(200).json("Unfollowed user");
      } else {
        res.status(403).json("Not following");
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.status(403).json("Can't unfollow self");
  }
});


// Take/Untake EECS16A
router.put("/:id/EECS16A", async (req, res) => {
  if (req.body.userId == req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      if (user.EECS16A === 1) {
        await user.update({$set:{EECS16A: 0}});
        res.status(200).json("EECS16A has been untaken");
      } else if (user.EECS16A === 0){
        await user.update({$set:{EECS16A: 1}});
        res.status(200).json("EECS16A has been taken");
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    return res.status(403).json("No permissions");
  }
});

// Take/Untake EECS16B
router.put("/:id/EECS16B", async (req, res) => {
  if (req.body.userId == req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      if (user.EECS16B === 1) {
        await user.update({$set:{EECS16B: 0}});
        res.status(200).json("EECS16B has been untaken");
      } else if (user.EECS16B === 0){
        await user.update({$set:{EECS16B: 1}});
        res.status(200).json("EECS16B has been taken");
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    return res.status(403).json("No permissions");
  }
});


// Take/Untake CS61A
router.put("/:id/CS61A", async (req, res) => {
  if (req.body.userId == req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      if (user.CS61A === 1) {
        await user.update({$set:{CS61A: 0}});
        res.status(200).json("CS61A has been untaken");
      } else if (user.CS61A === 0){
        await user.update({$set:{CS61A: 1}});
        res.status(200).json("CS61A has been taken");
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    return res.status(403).json("No permissions");
  }
});



// Take/Untake CS61B
router.put("/:id/CS61B", async (req, res) => {
  if (req.body.userId == req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      if (user.CS61B === 1) {
        await user.update({$set:{CS61B: 0}});
        res.status(200).json("CS61B has been untaken");
      } else if (user.CS61B === 0){
        await user.update({$set:{CS61B: 1}});
        res.status(200).json("CS61B has been taken");
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    return res.status(403).json("No permissions");
  }
});


// Take/Untake CS70
router.put("/:id/CS70", async (req, res) => {
  if (req.body.userId == req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      if (user.CS70 === 1) {
        await user.update({$set:{CS70: 0}});
        res.status(200).json("CS70 has been untaken");
      } else if (user.CS70 === 0){
        await user.update({$set:{CS70: 1}});
        res.status(200).json("CS70 has been taken");
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    return res.status(403).json("No permissions");
  }
});

// Use/Dont use ZOOM
router.put("/:id/ZOOM", async (req, res) => {
  if (req.body.userId == req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      if (user.ZOOM === 1) {
        await user.update({$set:{ZOOM: 0}});
        res.status(200).json("The user don't use zoom");
      } else if (user.ZOOM === 0){
        await user.update({$set:{ZOOM: 1}});
        res.status(200).json("The user uses zoom");
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    return res.status(403).json("No permissions");
  }
});

// Work/Dont work on WEEKEND
router.put("/:id/WEEKEND", async (req, res) => {
  if (req.body.userId == req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      if (user.WEEKEND === 1) {
        await user.update({$set:{WEEKEND: 0}});
        res.status(200).json("The user don't work on weekend");
      } else if (user.WEEKEND === 0){
        await user.update({$set:{WEEKEND: 1}});
        res.status(200).json("The user work on weekend");
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    return res.status(403).json("No permissions");
  }
});


// Func that returns an array of [similarity, _id]
async function similarity(userId) {
  try {
    // Get all users' features
    const user = await User.findById(userId);
    const EECS16A = await User.find({}, {EECS16A:1, _id:0});
    const EECS16B = await User.find({}, {EECS16B:1, _id:0});
    const CS61A = await User.find({}, {CS61A:1, _id:0});
    const CS61B = await User.find({}, {CS61B:1, _id:0});
    const CS70 = await User.find({}, {CS70:1, _id:0});
    const ZOOM = await User.find({}, {ZOOM: 1, _id:0});
    const WEEKEND = await User.find({}, {WEEKEND: 1, _id:0});
    const IDs = await User.find({}, {_id:1});

    const num = IDs.length; // number of users
    let bitsRank = new Array(num);
    const userFeatures = [user.EECS16A, user.EECS16B, user.CS61A, user.CS61B, user.CS70, user.ZOOM, user.WEEKEND];
    const numFeatures = userFeatures.length; // number of features

    // Get number of common bits in all features with respect to the user
    for (let i = 0; i < num; i++) {
      let otherFeatures = [EECS16A[i].EECS16A, EECS16B[i].EECS16B, CS61A[i].CS61A, CS61B[i].CS61B, CS70[i].CS70, ZOOM[i].ZOOM, WEEKEND[i].WEEKEND];
      let count = 0;
      // Count the number of bit == 1 for each bit-and operation
      for (let j = 0; j < numFeatures; j++) {
        count += userFeatures[j] & otherFeatures[j]; // bit-and == 1 if 2 people have the same feature
      }
      // pair up common bits with userId
      bitsRank[i] = [count, IDs[i]._id];
    }

    // Sort bits in descending order according to common bits
    bitsRank.sort((a, b) => b[0] - a[0]);

    // Exclude the user who calls the similarity ranking
    return bitsRank.filter(x => x[1] != userId);
  } catch (err) {
    console.log(err);
  }
;}



// Get Similarity Ranking
router.get("/similarity", async (req, res) => {
  try{
    const bitsRank = await similarity(req.body.userId);
    res.status(200).json(bitsRank);
  } catch (err) {
    console.log(err);
  }
});


// Get Top 3 people in the similarity rank with descriptions
router.get("/similarity/top3", async (req, res) => {
  try {
    let features = new Array(3);
    const bitsRank = await similarity(req.body.userId);
    const bitsRank3 = bitsRank.slice(0, 3);
    for (let i = 0; i < 3; i++) {
      const sim = bitsRank3[i][0];
      const id = bitsRank3[i][1];
      const user = await User.findById(id);
      features[i] = [user.username, sim, user.description];
    }
    res.status(200).json(features);
  } catch (err) {
    console.log(err);
  }
});

// Get Top 6 people in the similarity rank with features
router.get("/similarity/top6", async (req, res) => {
  try {
    let features = new Array(6);
    const bitsRank = await similarity(req.body.userId);
    const bitsRank6 = bitsRank.slice(0, 6);
    for (let i = 0; i < 6; i++) {
      const sim = bitsRank6[i][0];
      const id = bitsRank6[i][1];
      const user = await User.findById(id);
      features[i] = [user.username, user.EECS16A, user.EECS16B, user.CS61A, user.CS61B, user.CS70, user.ZOOM, user.WEEKEND, sim];
    }
    res.status(200).json(features);
  } catch (err) {
    console.log(err);
  }
});



module.exports = router;
