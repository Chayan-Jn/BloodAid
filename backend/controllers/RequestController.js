import User from "../models/User.js";

const RequestController = async (req,res)=>{
    try {
        const currentUser = req.user.userId;
        const { state, district,bloodType} = req.body;
        if(!state || !district || !bloodType){
            return res.status(400).json({
                success:false,
                message:"Fill all fields"
            })
        }
        const donors = await User.aggregate([
            {
                $match:{
                    available:true,
                    location:{state,district},
                    bloodType:bloodType
                }
            },
            {$sort:{name:1}},
            { 
                $project: {
                    _id: 0,
                    name: 1,
                    bloodType: 1,
                    mobile: 1,
                    location: 1
                }
            }
        ]);
        return res.status(200).json({
            success: true,
            message: "Successfully fetched donors",
            donors:donors
        });
    }
    catch (err) {
        console.log("Error in Request Controller ", err)
        return res.json({
            success: false,
            message: "Internal Server Error. Please try again"
        })
    }

}

export default RequestController;