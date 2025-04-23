        res.status(200).json({
            status: "success",
            message: "Login successful",
            data: { user_id: user._id, user_type: userType, token, role: userType },
        });