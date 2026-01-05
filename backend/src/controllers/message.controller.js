import User from '../modules/user.model.js'
import Message from '../modules/message.model.js'
import cloudinary from '../lib/cloudinary.js'

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id
		const filteredUsers = await User.find({
			_id: { $ne: loggedInUserId },
		}).select('-password')
		res.status(200).json(filteredUsers)
	} catch (error) {
		console.log('Error in getUsersForSidebar', error.message)

		res.status(500).json({ error: 'internal server error' })
	}
}

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params
		const myId = req.user._id
		const messages = await Message({
			$or: [
				{ senderId: myId, recieverId: userToChatId },
				{ senderId: userToChatId, recieverId: myId },
			],
		})
		res.status(200).json(messages)
	} catch (error) {
		console.log('Error in message controller', error.message)
		res.status(500).json({ error: 'Internal server Error' })
	}
}

export const sendMessage = async (req, res) => {
	try {
		const { text, image } = req.body
		const { id: recieverId } = req.params
		const senderId = req.user._id

		let imageUrl
		if (image) {
			const uploadResponse = await cloudinary.uploader.upload(image)
			imageUrl = uploadResponse.secure_url
		}

		const newMessage = new Message({
			senderId,
			recieverId,
			text,
			image: imageUrl,
		})

		await newMessage.save()

		res.status(201).json(newMessage)
	} catch (error) {
		console.log('Error in sendMessage controller', error.message)
		res.status(500).json({ error: 'Internal server Error' })
	}
}
