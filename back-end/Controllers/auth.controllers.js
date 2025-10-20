import User from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import gentoken from "../utils/token.js";

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
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        });

        return res.status(201).json({
            message: "Signup done",
            user
        });
    } catch (error) {
        return res.status(500).json(`error while creating the user ${error.message}`); 
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
        return res.status(500).json({ message: `Error while creating the user: ${error.message}` });

    }
};


export const signOut = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logout successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Error while logging out: ${error.message}` });
    }
};
