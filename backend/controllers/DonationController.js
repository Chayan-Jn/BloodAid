import User from '../models/User.js'
const DonateController = async (req, res) => {
    try {
        const currentUser = req.user.userId;
        const { state, district,bloodType,mobile,name} = req.body;
        if(!state || !district || !bloodType || !mobile || !name){
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
                    available:true,
                    name:name
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

export const countDonorsInArea = async (req,res)=>{
    try{
        const user = await User.findOne({_id:req.user.userId});
        const {district,state} = user.location ?? {};
        if(!user || !state || !district){
            return res.status(400).json({
                success:false,
                message:"Fill all fields"
            })
        }
        const totalDonors = await User.countDocuments({
            'location.state':state,
            'location.district':district
        })
        return res.status(200).json({
            success:true,
            message:"Total donors fetched successfully ",
            count:totalDonors
        })

    }
    catch(err){
        console.log("Error in count Donors controller ", err)
        return res.json({
            success: false,
            message: "Internal Server Error. Please try again"
        })
    }
}

export default DonateController