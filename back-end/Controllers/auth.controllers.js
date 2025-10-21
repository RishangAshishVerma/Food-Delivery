import User from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import gentoken from "../utils/token.js";
import { sendmail } from "../utils/nodemailer.js"

export const signUp = async (req, res) => {
    try {
        const { fullname, email, password, mobile, role } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ message: "User Already exist." });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "password must at least 6 characters." });
        }
        if (mobile.length < 10) {
            return res.status(400).json({ message: "mobile no must be at least 10 digits. " });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = await User.create({
            fullname,
            email,
            password: hashedPassword,
            mobile,
            role
        });

        const token = await gentoken(user.id);
        const subject = `Welcome to food Clone, ${fullname}! 🏡`;
        const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #FF385C;">Hello, ${fullname}!</h2>
            <p>Thanks for signing up on our Airbnb Clone.</p>
            <p>You can now explore and enjoy the app 🚀</p>
        </div>`;

        await sendmail(email, subject, "Welcome to Airbnb Clone!", htmlContent);

        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: false
        });
        return res.status(201).json({
            message: "Signup done",
            user
        });
    } catch (error) {
        return res.status(500).json(`error while creating the user ${error}`);
    }
};


export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User dose not exist." });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "password must at least 6 characters." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "password dosenot match " });
        }

        const token = await gentoken(user.id);
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        });

        return res.status(200).json({
            message: "SignIn done",
            user
        });
    } catch (error) {
        return res.status(500).json({ message: `Error while creating the user: ${error}` });

    }
};


export const signOut = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logout successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Error while logging out: ${error}` });
    }
};


export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User dose not exist." });
        }
        const name = user.fullname
        const role = user.role
        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        user.resetotp = otp
        user.otpexpires = Date.now() + 5 * 60 * 1000
        user.isoptverified = false
        await user.save()

        const subject = `Password Reset Request`;

        const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #FF385C;">Hello, ${name}</h2>
            <p>We received a request to reset the password for your ${role} account on Food Delivery.</p>
            <p>Please use the One-Time Password (OTP) below to complete your password reset process:</p>
            <h3 style="color: #333; letter-spacing: 2px;">${otp}</h3>
            <p>This OTP is valid for 5 minutes. If you did not request a password reset, please ignore this email.</p>
            <p>Thank you,<br>The Food Delivery Team</p>
        </div>`;

        await sendmail(email, subject, "Welcome to Food Delivery !", htmlContent)

        return res.status(201).json({ message: "OTP generated and sent successfully" })

    } catch (error) {
        return res.status(500).json({ message: `Error while sending the OTP: ${error}` })

    }
}

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required." });
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User does not exist." });
        }

        if (user.resetotp !== otp) {
            return res.status(400).json({ message: "Invalid OTP." });
        }

        if (user.otpexpires < Date.now()) {
            return res.status(410).json({ message: "OTP has expired." }); // 410 Gone = resource no longer valid
        }
        user.isoptverified = true
        user.resetotp = undefined
        user.otpexpires = undefined

        await user.save()

        return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Error while verifying the OTP: ${error}` });

    }
}

export const resetPassword = async (req, res) => {
    try {
        const { email, newpassword } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }
        if (!user.isoptverified) {
            return res.status(403).json({ message: "User is not verified" });
        }
        if (!newpassword) {
            return res.status(400).json({ message: "New password is required" });
        }
        const hashedPassword = await bcrypt.hash(newpassword, 10)
        user.password = hashedPassword
        user.isoptverified = false
        await user.save()
        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Error while resetting password: ${error}` });

    }
}