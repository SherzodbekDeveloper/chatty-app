import { generateToken, isValidEmail, sanitizeInput } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body

  try {
    const cleanFullName = sanitizeInput(fullName)
    const cleanEmail = sanitizeInput(email).toLowerCase()
    const cleanPassword = password

    if (!cleanFullName || !cleanEmail || !cleanPassword) {
      return res.status(400).json({ message: "All fields are required" })
    }

    if (cleanPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" })
    }

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ message: "Invalid email format" })
    }

    const existingUser = await User.findOne({ email: cleanEmail })
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(cleanPassword, salt)

    const newUser = new User({
      fullName: cleanFullName,
      email: cleanEmail,
      password: hashedPassword,
    })

    await newUser.save()

    generateToken(newUser._id, res)

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    })
  } catch (error) {
    console.error("Signup error:", error.message)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const cleanEmail = sanitizeInput(email).toLowerCase()
    const cleanPassword = password

    if (!cleanEmail || !cleanPassword) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    const user = await User.findOne({ email: cleanEmail })
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const isPasswordCorrect = await bcrypt.compare(cleanPassword, user.password)
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    generateToken(user._id, res)

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    })
  } catch (error) {
    console.error("Login error:", error.message)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })
    res.status(200).json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout error:", error.message)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body
    const userId = req.user._id

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" })
    }

    if (profilePic.length > 5 * 1024 * 1024) {
      return res.status(400).json({ message: "File size must be less than 5MB" })
    }

    let uploadResponse
    try {
      uploadResponse = await cloudinary.uploader.upload(profilePic, {
        folder: "chat-app/profiles",
        resource_type: "auto",
      })
    } catch (uploadError) {
      console.error("Cloudinary upload error:", uploadError.message)
      return res.status(400).json({ message: "Failed to upload image" })
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true },
    ).select("-password")

    res.status(200).json(updatedUser)
  } catch (error) {
    console.error("Update profile error:", error.message)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user)
  } catch (error) {
    console.error("Check auth error:", error.message)
    res.status(500).json({ message: "Internal server error" })
  }
}
