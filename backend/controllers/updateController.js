import User from "../models/User.js";

const Update = async (req, res) => {
    try {
        const { name, mobile, age, bloodType, state, district, gender } = req.body;

        const allFieldsFilled = [name, mobile, age, bloodType, state, district, gender].every(field => field !== undefined && field !== '' && field.toString().length < 100); // This also checks maxLength of input

        if (!allFieldsFilled) {
            return res.status(400).json({
                success: false,
                message: "Fill all fields"
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            {
                $set: {
                    name,
                    mobile,
                    age,
                    bloodType,
                    location: { state, district },
                    gender,
                    profileComplete: true
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Successfully Updated Profile",
            user: updatedUser
        });
    } catch (err) {
        console.log("Error in Update Controller", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.Try again"
        });
    }
};

export default Update;
