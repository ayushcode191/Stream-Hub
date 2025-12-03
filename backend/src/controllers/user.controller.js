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