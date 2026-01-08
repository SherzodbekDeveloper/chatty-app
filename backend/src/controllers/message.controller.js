import mongoose from "mongoose"
import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js"

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id

    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } })
      .select("-password")
      .lean()

    res.status(200).json(filteredUsers)
  } catch (error) {
    console.error("Get users error:", error.message)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params
    const myId = req.user._id

    if (!userToChatId || !myId) {
      return res.status(400).json({ error: "Invalid user IDs" })
    }

    const userToChatIdObj = new mongoose.Types.ObjectId(userToChatId)

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatIdObj },
        { senderId: userToChatIdObj, receiverId: myId },
      ],
    }).sort({ createdAt: 1 })

    res.status(200).json(messages)
  } catch (error) {
    console.error("Get messages error:", error.message)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body
    const { id: receiverId } = req.params
    const senderId = req.user._id

    if (!text && !image) {
      return res.status(400).json({ error: "Message must contain text or image" })
    }

    if (!receiverId) {
      return res.status(400).json({ error: "Receiver ID is required" })
    }

    let receiverIdObj
    try {
      receiverIdObj = new mongoose.Types.ObjectId(receiverId)
    } catch (err) {
      return res.status(400).json({ error: "Invalid receiver ID format" })
    }

    const receiver = await User.findById(receiverIdObj)
    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found" })
    }

    let imageUrl
    if (image) {
      if (image.length > 10 * 1024 * 1024) {
        return res.status(400).json({ error: "Image size must be less than 10MB" })
      }

      try {
        const uploadResponse = await cloudinary.uploader.upload(image, {
          folder: "chat-app/messages",
          resource_type: "auto",
        })
        imageUrl = uploadResponse.secure_url
      } catch (uploadError) {
        console.error("Image upload error:", uploadError.message)
        return res.status(400).json({ error: "Failed to upload image" })
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId: receiverIdObj,
      text: text || "",
      image: imageUrl,
    })

    await newMessage.save()

    const receiverSocketId = getReceiverSocketId(receiverIdObj.toString())
    if (receiverSocketId) {
      
      const messageObj = newMessage.toObject()
      io.to(receiverSocketId).emit("newMessage", messageObj)
    }

    res.status(201).json(newMessage)
  } catch (error) {
    console.error("Send message error:", error.message)
    res.status(500).json({ error: "Internal server error" })
  }
}
