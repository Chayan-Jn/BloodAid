import User from "../models/User.js";
import Request from '../models/Requests.js'

// Creates a Request
export const CreateRequest = async (req, res) => {
    try {
        const currentUser = req.user.userId;
        const { bloodType, units, location } = req.body
        const { state, district } = location
        if (!state || !district || !bloodType || !units) {
            return res.status(400).json({
                success: false,
                message: "Fill all fields"
            })
        }
        if (!currentUser) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        await Request.create({
            requester: currentUser,
            location: {
                state,
                district,
            },
            bloodType,
            units
        })

        return res.status(200).json({
            success: true,
            message: "Successfully Created a Request",
        });
    }
    catch (err) {
        console.log("Error in Create Request Controller ", err)
        return res.json({
            success: false,
            message: "Internal Server Error. Please try again"
        })
    }
}

// Finds donors
const RequestController = async (req, res) => {
    try {
        const currentUser = req.user.userId;
        const { state, district, bloodType } = req.body;
        if (!state || !district || !bloodType) {
            return res.status(400).json({
                success: false,
                message: "Fill all fields"
            })
        }
        const donors = await User.aggregate([
            {
                $match: {
                    available: true,
                    location: { state, district },
                    bloodType: bloodType
                }
            },
            { $sort: { name: 1 } },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    bloodType: 1,
                    mobile: 1,
                    location: 1,
                    email: 1
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            message: "Successfully fetched donors",
            donors: donors
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


export const countRequestsInArea = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.userId });
        const { district, state } = user.location;
        if (!user || !state || !district) {
            return res.status(400).json({
                success: false,
                message: "Fill all fields"
            })
        }
        console.log(await Request.find({}));
        const totalRequests = await Request.countDocuments({
            'location.state': state,
            'location.district': district
        })
        return res.status(200).json({
            success: true,
            message: "Total Requests fetched successfully ",
            count: totalRequests
        })

    }
    catch (err) {
        console.log("Error in count Donors controller ", err)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again"
        })
    }
}

export const myRequests = async (req, res) => {
    try {
        const requests = await Request.find({ requester: req.user.userId });
        console.log(requests)
        return res.status(200).json({
            success: true,
            requests
        });
    }
    catch (err) {
        console.log('Error in my request controller \n ', err)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const changeRequestStatus = async (req,res)=>{
    try{
        const {reqId,status} = req.body;
        const updated = await Request.findByIdAndUpdate(reqId,
            { status:status },
            {new:true}
        )
        if (!updated) return res.status(404).json({ message: 'Request not found' })
    
        return res.json({ message: 'Status updated successfully', request: updated })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Error occured while changing status of the request "
        })
    }
}

export const areaRequests = async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user.userId })
      if (!user || !user.location || !user.location.state || !user.location.district) {
        return res.status(400).json({
          success: false,
          message: "Fill all fields"
        })
      }
  
      const { state, district } = user.location
  
      const requestsInArea = await Request.find({
        'location.state': state,
        'location.district': district
      })
  
      if (!requestsInArea.length) {
        return res.status(200).json({
          success: true,
          message: "No Requests in Area",
          requests: []
        })
      }
  
      return res.status(200).json({
        success: true,
        message: "Requests fetched successfully",
        requests: requestsInArea
      })
    } catch (err) {
      console.log("Error in area requests", err)
      return res.status(500).json({
        success: false,
        message: "Internal Server Error.Try again"
      })
    }
  }
  

export default RequestController;