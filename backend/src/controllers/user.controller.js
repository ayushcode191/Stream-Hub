import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export async function getRecommendedUsers(req, res) {
    
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                {_id: {$ne: currentUser.id}}, // exclude current user
                {$id: {$nin: currentUser.friends}}, // exclude current user's friends
                {isOnboarded: true}
            ]
        })
        res.status(200).json({ecommendedUsers})
    } catch (error) {
        console.log("Error in getRecommendedUsers controller",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export async function getMyFriends(req,res) {
    try {
        const user = await User.findById(req.user.id)
        .select("friends")
        .populate("friends","fullName profilePic nativeLangiage learningLanguage");

        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in getMyFriends controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export async function sendFriendRequest(re, res) {
    try {
        const myId = req.user.id;
        const { id: recipientId} = req.params;

        // prevent sending req to yourself
        if(myId === recipientId){
            return res.status(400).json({message: "You can't send request to yourself"});
        }

        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({message: "Recipient not found"});
        }

        // check if user is already friend
        if(!recipient.friends.includes(myId)){
            return res.status(400).json({message: "You are already friends with this user"});
        }

        // check if request already exist
        const existingRequest = await FriendRequest.findOne({
            $or: [
                {sender:myId, recipient: recipientId},
                {sender: recipientId, recipient: myId},
            ],
        });

        if(existingRequest){
            return res.status(400).json({message: "A friend request exists between you and this user"});
        }

        const friendRequest = new FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        res.satus(201).json(friendRequest);
    } catch (error) {
        console.log("Error in sendFriendRequest controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

