import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../config/firebase';
import { useState } from 'react';

export const ProfileSection = ({ profileData, friends, uid, setParamSelection }) => {

    const [profileImg, setProfileImg] = useState(profileData.profilePicture)
    const [bioContent, setBioContent] = useState(profileData.bio)
    const [bio, setBio] = useState(true)

    const AddFriendBtn = () => {
        if (uid !== profileData.uid) {
            return <button className="addFriend">Add friend <PersonAddIcon /></button>
        } else return
    }

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const base64Image = await convertToBase64(file);
            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, {
                profilePicture: base64Image
            });
            setProfileImg(base64Image)
        }
    };

    const updateBio = async (e) => {
        e.preventDefault()
        if (bioContent !== '') {
            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, {
                bio: bioContent
            });
            setBio(true)
        }
    }

    return (
        <div className="profileSection">
            <label className={profileData.uid === uid ? 'clickable' : 'notClickable'} htmlFor="photo">
                <img src={profileImg} alt="" />
                {profileData.uid === uid && <p>Change your photo</p>}
            </label>
            {profileData.uid === uid && <input type="file" accept="image/*" onChange={handleFileChange} name="photo" id="photo" />}
            <div className="detailContainer">
                <div className="details">
                    <div className="nameDetails">
                        <div className="username">{profileData.username}</div>
                        <AddFriendBtn />
                    </div>
                    {bio && <div className="bio">{profileData.bio ? bioContent : "You don't have a bio yet"} <EditIcon onClick={() => setBio(false)} /></div>}
                    <form onSubmit={updateBio}>
                        {!bio && (
                            <input
                                type="text"
                                onChange={(e) => setBioContent(e.target.value)}
                                placeholder="Write your bio"
                                value={bioContent}
                            />
                        )}
                        <button type="submit" hidden>Submit</button>
                    </form>
                </div>
                <div className="switchBtns">
                    <label onClick={() => setParamSelection('timeline')}>
                        <input type="radio" defaultChecked='true' id="value-1" name="value-radio" />
                        <span>Timeline</span>
                    </label>
                    <label onClick={() => setParamSelection('about')}>
                        <input type="radio" id="value-2" name="value-radio" />
                        <span>About</span>
                    </label>
                    <label onClick={() => setParamSelection('friends')}>
                        <input type="radio" id="value-3" name="value-radio" />
                        <span>Friends</span>
                    </label>
                </div>
            </div>
        </div>
    )
}