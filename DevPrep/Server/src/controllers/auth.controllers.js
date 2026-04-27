import userModel from "../models/user.models.js";
import sessionModel from "../models/session.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



const cookieOptions = {
	httpOnly: true,
	secure: true, 
	sameSite: "None", 
	maxAge: 7 * 24 * 60 * 60 * 1000,
};

const generateAccessToken = (userId) => {
	return jwt.sign(
		{ userId },
		process.env.JWT_ACCESS_TOKEN,
		{ expiresIn: "10m" }
	);
};

const generateRefreshToken = (userId) => {
	return jwt.sign(
		{ userId },
		process.env.JWT_REFRESH_TOKEN,
		{ expiresIn: "7d" }
	);
};

const createSession = async (userId, req, hashedRefreshToken) => {
	return await sessionModel.create({
		user: userId,
		ip: req.ip,
		userAgent: req.headers["user-agent"],
		refreshToken: hashedRefreshToken,
	});
};

const saveRefreshToken = async (user, refreshToken) => {
	const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
	user.refreshToken = hashedRefreshToken;
	await user.save();
	return hashedRefreshToken;
};


export const register = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({
				message: "All fields are required",
			});
		}

		if (!validator.isEmail(email)) {
			return res.status(400).json({
				message: "Invalid email",
			});
		}

		if (password.length < 8) {
			return res.status(400).json({
				message: "Password must be at least 8 characters",
			});
		}

		if (
			!/[A-Z]/.test(password) ||
			!/[a-z]/.test(password) ||
			!/[0-9]/.test(password)
		) {
			return res.status(400).json({
				message:
					"Password must contain uppercase, lowercase and number",
			});
		}

		const existingUser = await userModel.findOne({
			$or: [{ email }, { name }],
		});

		if (existingUser) {
			return res.status(400).json({
				message: "User already exists",
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await userModel.create({
			name,
			email,
			password: hashedPassword,
		});

		const accessToken = generateAccessToken(newUser._id);
		const refreshToken = generateRefreshToken(newUser._id);

		const hashedRefreshToken = await saveRefreshToken(
			newUser,
			refreshToken
		);

		const session = await createSession(
			newUser._id,
			req,
			hashedRefreshToken
		);

		res.cookie("refreshToken", refreshToken, cookieOptions);

		return res.status(201).json({
			message: "User registered successfully",
			data: {
				userId: newUser._id,
				name: newUser.name,
				email: newUser.email,
				accessToken,
			},
			session,
		});
	} catch (error) {
		console.log("Register Error:", error);

		return res.status(500).json({
			message: "Something went wrong",
		});
	}
};


export const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({
				message: "All fields are required",
			});
		}

		let user;

		if (validator.isEmail(username)) {
			user = await userModel.findOne({ email: username });
		} else {
			user = await userModel.findOne({ name: username });
		}

		if (!user) {
			return res.status(400).json({
				message: "User not found",
			});
		}

		if (!user.password) {
			return res.status(400).json({
				message: "Please login using Google",
			});
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(400).json({
				message: "Incorrect password",
			});
		}

		const accessToken = generateAccessToken(user._id);
		const refreshToken = generateRefreshToken(user._id);

		const hashedRefreshToken = await saveRefreshToken(
			user,
			refreshToken
		);

		const session = await createSession(
			user._id,
			req,
			hashedRefreshToken
		);

		res.cookie("refreshToken", refreshToken, cookieOptions);

		return res.status(200).json({
			message: "Login successful",
			data: {
				userId: user._id,
				name: user.name,
				email: user.email,
				accessToken,
			},
			session,
		});
	} catch (error) {
		console.log("Login Error:", error);

		return res.status(500).json({
			message: "Something went wrong",
		});
	}
};



export const tokenGeneration = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			return res.status(401).json({
				message: "Refresh token missing",
			});
		}

		const decoded = jwt.verify(
			refreshToken,
			process.env.JWT_REFRESH_TOKEN
		);

		const user = await userModel.findById(decoded.userId);

		if (!user) {
			return res.status(404).json({
				message: "User not found",
			});
		}

		const isMatch = await bcrypt.compare(
			refreshToken,
			user.refreshToken
		);

		if (!isMatch) {
			return res.status(401).json({
				message: "Invalid refresh token",
			});
		}
		const session = await sessionModel.findOne({
      user: decoded.userId,
      revoke: false
    });
    
    if (!session) {
      return res.status(401).json({ message: "Session not found or revoked" });
    }
		

		const newRefreshToken = generateRefreshToken(user._id);
		const newAccessToken = generateAccessToken(user._id);

		const hashedRefreshToken = await bcrypt.hash(
			newRefreshToken,
			10
		);

		user.refreshToken = hashedRefreshToken;
		await user.save();

		await sessionModel.findOneAndUpdate(
			{ user: user._id, revoke: false },
			{
				refreshToken: hashedRefreshToken,
			}
		);

		res.cookie("refreshToken", newRefreshToken, cookieOptions);
		console.log("Cookies:", req.cookies);
		console.log("Refresh Token:", req.cookies.refreshToken);

		return res.status(200).json({
			message: "Access token generated successfully",
			accessToken: newAccessToken,
		});
	} catch (error) {
  console.log("Refresh Token Error:", error);

  return res.status(401).json({
    message: "Invalid or expired refresh token",
  });
}
};



export const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			return res.status(400).json({
				message: "Refresh token missing",
			});
		}

		const decoded = jwt.verify(
			refreshToken,
			process.env.JWT_REFRESH_TOKEN
		);

		await userModel.findByIdAndUpdate(decoded.userId, {
			refreshToken: null,
		});

		await sessionModel.findOneAndUpdate(
			{
				user: decoded.userId,
				revoke: false,
			},
			{
				revoke: true,
			}
		);

		res.clearCookie("refreshToken", {
  			httpOnly: true,
  			secure: true,
 		 	sameSite: "None",
		});

		return res.status(200).json({
			message: "Logout successful",
		});
	} catch (error) {
		console.log("Logout Error:", error);

		return res.status(500).json({
			message: "Something went wrong",
		});
	}
};


export const googleLogin = async (req, res) => {
	try {
		const { credential } = req.body;

		if (!credential) {
			return res.status(400).json({
				message: "Google credential required",
			});
		}

		const ticket = await googleClient.verifyIdToken({
			idToken: credential,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();

		const {
			email,
			name,
			sub: googleId,
			picture,
		} = payload;

		if (!email) {
			return res.status(400).json({
				message: "Google email not found",
			});
		}

		let user = await userModel.findOne({ email });

		if (!user) {
			let finalName = name || email.split("@")[0];

			const nameExists = await userModel.findOne({
				name: finalName,
			});

			if (nameExists) {
				finalName = `${finalName}_${Math.floor(
					Math.random() * 10000
				)}`;
			}

			user = await userModel.create({
				name: finalName,
				email,
				googleId,
				avatar: picture,
				isGoogleUser: true,
			});
		} else if (!user.googleId) {
			user.googleId = googleId;
			user.isGoogleUser = true;

			if (picture && !user.avatar) {
				user.avatar = picture;
			}

			await user.save();
		}

		const accessToken = generateAccessToken(user._id);
		const refreshToken = generateRefreshToken(user._id);

		const hashedRefreshToken = await saveRefreshToken(
			user,
			refreshToken
		);

		const session = await createSession(
			user._id,
			req,
			hashedRefreshToken
		);

		res.cookie("refreshToken", refreshToken, cookieOptions);

		return res.status(200).json({
			message: "Google login successful",
			data: {
				userId: user._id,
				name: user.name,
				email: user.email,
				avatar: user.avatar,
				accessToken,
			},
			session,
		});
	} catch (error) {
		console.log("Google Login Error:", error);

		return res.status(500).json({
			message: "Google login failed",
			error: error.message,
		});
	}
};
