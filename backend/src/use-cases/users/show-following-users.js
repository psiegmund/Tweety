import UserDAO from "../../db-access/users-dao.js";
import { generateSignedAvatarUrl } from "../../utils/s3/s3-avatar-signature.js";

export const showFollowingUsers = async (userId) => {
	const foundUser = await UserDAO.findUserById(userId);
	const followingUserIdsArray = foundUser.following;

	const userDataArray = await Promise.all(
		followingUserIdsArray.map(async (user) => {
			const followingUser = await UserDAO.findUserById(user);

			const avatarKey = followingUser.profilePictureLink;
			const avatarLink = await generateSignedAvatarUrl(avatarKey);
			followingUser.profilePictureLink = avatarLink;
			console.log('kommst du hierher??')

			const returnfollowingUserData = {
				_id: followingUser._id,
				profilePictureLink: followingUser.profilePictureLink,
				firstName: followingUser.firstName,
				lastName: followingUser.lastName,
				username: followingUser.username,
				bio: followingUser.bio,
				followedBy: followingUser.followedBy
			};
			return returnfollowingUserData;
		})
	);

	return userDataArray;
};
