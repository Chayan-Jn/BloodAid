import User from '../models/User.js'
const DonateController = async (req, res) => {
    try {
        const currentUser = req.user.userId;
        const { state, district,bloodType,mobile} = req.body;
        if(!state || !district || !bloodType || !mobile){
            return res.status(400).json({
                success:false,
                message:"Fill all fields"
            })
        }
        const newDonor = await User.findByIdAndUpdate(
            currentUser,
            {
                $set:{
                    location:{state,district},
                    bloodType:bloodType,
                    mobile:mobile,
                    available:true
                }
            },
            { new:true }
        );
        return res.status(200).json({
            success: true,
            message: "Successfully registered as a donor"
        });
    }
    catch (err) {
        console.log("Error in Donate Controller ", err)
        return res.json({
            success: false,
            message: "Internal Server Error. Please try again"
        })
    }
}

export default DonateController