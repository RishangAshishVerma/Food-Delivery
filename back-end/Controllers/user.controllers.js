import User from "../Models/user.model.js"

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId
        if (!userId) {
            return res.status(400).json({ message: "User ID is required." })
        }
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while retrieving the current user." });

    }
}

export const updateUserLocation = async (req, res) => {
    try {
           const {lat,log} = req.body
           const user  = await User.findByIdAndUpdate(req.userId,{
            location:{
                type:"Point",
                coordinates:[log,lat]
            }
           })
           if (!user) {
            return res.status(400) .json({message:"user not found "})
           }         

           return res.status(200) .json({message:"User Location updated successfully"})
    } catch (error) {
return res.status(500) .json({message:`error while updateing the user location ${error}`})
    }
}