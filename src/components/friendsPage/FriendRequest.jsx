import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';

export const FriendRequest = ({ request, uid, userData, getUserFriends, getUserFriendRequests }) => {
    
    const navigate = useNavigate()

    const acceptRequest = async () => {
        const userRef = doc(db, "users", uid);
        const requestUserRef = doc(db, "users", request.uid)
        try {
            await updateDoc(userRef, {
                friends: arrayUnion({
                    uid: request.uid,
                    profilePicture: request.profilePicture,
                    username: request.username
                }),
            });
            await updateDoc(userRef, {
                friendRequests: arrayRemove({
                    uid: request.uid,
                    profilePicture: request.profilePicture,
                    username: request.username
                }),
            });
            await updateDoc(requestUserRef, {
                friends: arrayUnion({
                    uid: userData.uid,
                    profilePicture: userData.profilePicture,
                    username: userData.username
                }),
            });
            getUserFriendRequests()
            getUserFriends()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="friendRequestContainer">
            <div className="details">
                <img onClick={() => navigate(`/profile/${userData.uid}`)} src={request.profilePicture} alt="" />
                <p onClick={() => navigate(`/profile/${userData.uid}`)} className="name">{request.username}</p>
            </div>
            <div className="btns">
                <CheckIcon onClick={acceptRequest} className='acceptBtn' />
                <ClearIcon className='declineBtn' />
            </div>
        </div>
    )
}