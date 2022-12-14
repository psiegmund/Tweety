import SearchDAO from "../../db-access/search-dao.js";
import { generateSignedAvatarUrl } from "../../utils/s3/s3-avatar-signature.js";

export const topUsers = async () => {
    const usersSearch = await SearchDAO.searchTopUsers();
    // const userResult = usersSearch.foundUsers.sort((a,b) =>{
    //     a.likedTweets.length - b.likedTweets.length
    // })
    const userDataArray = await Promise.all(
        usersSearch.map(async (user) => {
            const avatarKey = user.profilePictureLink
            const avatarLink = await generateSignedAvatarUrl(avatarKey);
            user.profilePictureLink = avatarLink
            const userResult = {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                profilePictureLink: user.profilePictureLink,
                bio: user.bio,
                followedBy: user.followedBy
            };
            return userResult
        })
        );
        return userDataArray;
    }