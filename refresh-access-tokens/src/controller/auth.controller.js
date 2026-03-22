import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import RefreshToken from "../models/refreshToken.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/token.service.js";

// REGISTER CONTROLLER FUNCTION
export const register = async (req, res) => {
  // checking the credentials recieved from the body and returning if there is any error
  const { username, password } = req.body;
  if (!username || !password) {
    console.log(
      "required credentials not recieved from the body, request cannot be fulfilled..!!",
    );
    return res
      .status(400)
      .json({ message: "required credentials not recieved " });
  }

  try {
    // checking if the user exists if yes then returning the user
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "user already exists..!!" });

    // creating a entry for new user
    const newUser = await User.create({
      username,
      password,
    });

    // returning the response and success message
    res.status(201).json({ message: "user created successfully..!!" }, newUser);
  } catch (err) {
    console.error("error occured in register controller");
    throw err;
  }
};

// LOGIN CONTROLLER FUNCTION
export const login = async (req, res) => {
  // checking the credentials recieved from the body and returning if there is any error
  const { username, password } = req.body;
  if (!username || !password) {
    console.log(
      "required credentials not recieved from the body, request cannot be fulfilled..!!",
    );
    return res
      .status(400)
      .json({ message: "required credentials not recieved " });
  }

  try {
    // checking if the user already exists returning if not
    const existingUser = await User.findOne({ username });
    if (!existingUser)
      return res.status(400).json({ message: "user does not exists..!!" });

    // checking if the password matches
    const isValid = await existingUser.comparePassword(password);
    if (!isValid)
      return res.status(400).json({ message: "invalid credentials" });

    // generating access and refresh tokens
    const accessToken = await generateAccessToken(existingUser);
    const tokenData = await generateRefreshToken(existingUser);
    const refreshToken = tokenData.refreshToken;
    const tokenId = tokenData.tokenId;

    await RefreshToken.create({
      tokenId,
      userId: existingUser._id,
    });

    // saving the accessToken and refreshToken in the cookies
    res.cookie("access_tk", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
      sameSite: "strict",
    });

    res.cookie("refresh_tk", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    // returning the response with refresh token and success message
    res.status(200).json({
      message: "user logged in successfully..!!",
      user: { id: existingUser._id, username: existingUser.username },
    });
  } catch (err) {
    console.error("error occured in login controller");
    throw err;
  }
};

// REFRESH CONTROLLER FUNCTION
export const refresh = async (req, res) => {
  const refresh_tk = req.cookies.refresh_tk;
  if (!refresh_tk) {
    return res
      .status(401)
      .json({ message: "unauthorized, refresh token not found" });
  }

  jwt.verify(refresh_tk, process.env.REFRESH_SECRET, async (err, payload) => {
    if (err) return res.status(403).json({ message: "403 forbidden" });

    const stored = await RefreshToken.findOne({ tokenId: payload.tokenId });
    if (!stored) return res.status(403).json({ message: "403 forbidden" });

    // rotating the refresh cookie with new one
    await RefreshToken.deleteOne({ tokenId: payload.tokenId });
    const user = await User.findById(payload.id);

    const newAccessToken = generateAccessToken(user);
    const { refreshToken: newRefreshToken, tokenId } =
      generateRefreshToken(user);

    await RefreshToken.create({
      tokenId,
      user: user._id,
    });

    res.cookie("access_tk", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
      sameSite: "strict",
    });

    res.cookie("refresh_tk", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    res.status(200).json({ message: "refresh successfull..!!" });
  });
};

// LOGOUT CONTROLLER FUNCTION
export const logout = async (req, res) => {
  const refreshToken = req.cookies.refresh_tk;
  if (!refreshToken)
    return res.status(204).json({ message: "no refresh token found" });

  try {
    const payload = await new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET,
        async (err, payload) => {
          if (err) reject(err);
          else resolve(payload);
        },
      );
    });

    await RefreshToken.deleteOne({ tokenId: payload.tokenId });

    res.clearCookie("access_tk", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.clearCookie("refresh_tk", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "logout successful" });
  } catch (err) {
    res.status(403).json({ message: "invalid refresh token" });
  }
};
