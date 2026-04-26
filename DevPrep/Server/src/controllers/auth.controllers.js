import userModel from "../models/user.models.js";
import sessionModel from "../models/session.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
import validator from "validator";

export const register = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		if (!name || !email || !password) {
			return res.status(400).json({
				message: "All fields are required",
			});
		}
		if (password.length < 8) {
			return res.status(400).json({
				message: "Password must be at least 8 characters long",
			});
		}
		if (!/[A-Z]/.test(password)) {
			return res.status(400).json({
				message: "Password must contain at least one uppercase letter",
			});
		}
		if (!/[a-z]/.test(password)) {
			return res.status(400).json({
				message: "Password must contain at least one lowercase letter",
			});
		}
		if (!/[0-9]/.test(password)) {
			return res.status(400).json({
				message: "Password must contain at least one number",
			});
		}

		if (validator.isEmail(email) === false) {
			return res.status(400).json({
				message: "Email must be valid",
			});
		}
		const user = await userModel.findOne({
			$or: [{ email: email }, { name: name }],
		});
		if (user) {
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
		const refreshToken = jwt.sign(
			{
				userId: newUser._id,
			},
			process.env.JWT_REFRESH_TOKEN,
			{ expiresIn: "7d" },
		);
		const accessToken = jwt.sign(
			{
				userId: newUser._id,
			},
			process.env.JWT_ACCESS_TOKEN,
			{ expiresIn: "10m" },
		);
		const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
		newUser.refreshToken = hashedRefreshToken;
		await newUser.save();
		const session = await sessionModel.create({
			user: newUser._id,
			ip: req.ip,
			userAgent: req.headers["user-agent"],
			refreshToken: hashedRefreshToken,
		});
		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: false,
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});
		return res.status(201).json({
			message: "User created successfully",
			data: {
				userid: newUser._id,
				name: newUser.name,
				email: newUser.email,
				accessToken,
			},
			session: session,
		});
	} catch (err) {
		console.log("Error occured in register controller: ", err);
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
		let user = null;
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

		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			return res.status(400).json({
				message: "Password is incorrect",
			});
		}
		const refreshToken = jwt.sign(
			{
				userId: user._id,
			},
			process.env.JWT_REFRESH_TOKEN,
			{ expiresIn: "7d" },
		);
		const accessToken = jwt.sign(
			{
				userId: user._id,
			},
			process.env.JWT_ACCESS_TOKEN,
			{ expiresIn: "10m" },
		);
		const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
		user.refreshToken = hashedRefreshToken;
		await user.save();

		const session = await sessionModel.create({
			user: user._id,
			ip: req.ip,
			userAgent: req.headers["user-agent"],
			refreshToken: hashedRefreshToken,
		});

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: false,
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});
		return res.status(200).json({
			message: "User logged in succesfully",
			data: {
				name: user.name,
				email: user.email,
				accessToken,
			},
			session,
		});
	} catch (err) {
		console.log("Error occured in login controller: ", err);
		return res.status(500).json({
			message: "Something went wrong",
		});
	}
};
export const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		if (!refreshToken) {
			return res.status(400).json({
				message: "Refresh token not found",
			});
		}
		const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
		if (!decoded) {
			return res.status(400).json({
				message: "Invalid refresh token",
			});
		}
		const user = await userModel.findById(decoded.userId);
		if (!user) {
			return res.status(400).json({
				message: "User not found",
			});
		}
		const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);

		if (!isMatch) {
			return res.status(401).json({
				message: "Invalid refresh token",
			});
		}
		const session = await sessionModel.findOne({
			user: decoded.userId,
			revoke: false,
		});
		if (!session) {
			return res.status(400).json({
				message: "Session not found",
			});
		}
		session.revoke = true;
		await session.save();
		res.clearCookie("refreshToken");
		return res.status(200).json({
			message: "User logged out successfully",
		});
	} catch (err) {
		console.log("Error occured in logout controller: ", err);
		return res.status(500).json({
			message: "Something went wrong",
		});
	}
};
export const tokenGeneration = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		if (!refreshToken) {
			return res.status(400).json({
				message: "Refresh token not found",
			});
		}
		const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
		if (!decoded) {
			return res.status(400).json({
				message: "Invalid refresh token",
			});
		}
		const session = await sessionModel.findOne({ user: decoded.userId });
		if (!session) {
			return res.status(400).json({
				message: "Session not found",
			});
		}
		if (session.revoke === true) {
			return res.status(400).json({
				message: "Session has been revoked",
			});
		}

		const user = await userModel.findById(decoded.userId);
		if (!user) {
			return res.status(400).json({
				message: "User not found",
			});
		}
		const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);

		if (!isMatch) {
			return res.status(401).json({
				message: "Invalid refresh token",
			});
		}

		const refreshTokenNew = jwt.sign(
			{
				userId: user._id,
			},
			process.env.JWT_REFRESH_TOKEN,
			{ expiresIn: "7d" },
		);
		res.cookie("refreshToken", refreshTokenNew, {
			httpOnly: true,
			secure: false,
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});
		const hashedRefreshToken = await bcrypt.hash(refreshTokenNew, 10);
		user.refreshToken = hashedRefreshToken;
		session.refreshToken = refreshTokenNew;
		await session.save();
		await user.save();

		const accessToken = jwt.sign(
			{
				userId: user._id,
			},
			process.env.JWT_ACCESS_TOKEN,
			{ expiresIn: "10m" },
		);
		return res.status(200).json({
			message: "Access token generated successfully",
			accessToken,
		});
	} catch (err) {
		console.log("Error occured in tokenGeneration controller: ", err);
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
        message: "Google credential is required",
      });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;

    if (!email) {
      return res.status(400).json({
        message: "Email not found from Google",
      });
    }

    // Check if user exists by email FIRST (most important)
    let user = await userModel.findOne({ email });

    if (!user) {
      // User doesn't exist by email, check if name exists (conflict)
      const existingUserByName = await userModel.findOne({ name });
      
      if (existingUserByName) {
        // Name conflict - append something to make it unique
        const uniqueName = `${name}_${Math.floor(Math.random() * 10000)}`;
        console.log(`Name conflict: "${name}" already exists, using "${uniqueName}" instead`);
        
        user = await userModel.create({
          name: uniqueName,
          email,
          googleId,
          avatar: picture,
          isGoogleUser: true,
        });
      } else {
        // Create new user
        user = await userModel.create({
          name: name || email.split('@')[0],
          email,
          googleId,
          avatar: picture,
          isGoogleUser: true,
        });
      }
    } else if (!user.googleId) {
      // User exists by email but not linked to Google - link them
      console.log('Linking Google account to existing user:', email);
      user.googleId = googleId;
      user.isGoogleUser = true;
      if (picture && !user.avatar) {
        user.avatar = picture;
      }
      await user.save();
    }

    // Generate tokens
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: "7d" }
    );
    
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: "10m" }
    );

    // Hash and save refresh token
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    user.refreshToken = hashedRefreshToken;
    await user.save();

    // Create session
    const session = await sessionModel.create({
      user: user._id,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      refreshToken: hashedRefreshToken,
    });

    // Set cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Google login successful",
      data: {
        userid: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        accessToken,
      },
      session,
    });
  } catch (err) {
    console.error("Error occurred in googleLogin controller: ", err);
    return res.status(500).json({
      message: "Google login failed",
      error: err.message,
    });
  }
};
