import PersonAddIcon from '@mui/icons-material/PersonAdd';

export const ProfileSection = ({ profileData, friends, uid, setParamSelection }) => {

    const AddFriendBtn = () => {
        if (uid !== profileData.uid) {
            return <button className="addFriend">Add friend <PersonAddIcon /></button>
        } else return
    }

    return (
        <div className="profileSection">
            <img src={profileData.profilePicture} alt="" />
            <div className="detailContainer">
                <div className="details">
                    <div className="nameDetails">
                        <div className="username">{profileData.username}</div>
                        <AddFriendBtn />
                    </div>
                    <div className="bio">{profileData.bio ? profileData.bio : 'Max 46 karakter olcak you dont have a bio yet'}</div>
                </div>
                <div className="switchBtns">
                    <label onClick={() => setParamSelection('timeline')}>
                        <input type="radio" defaultChecked='true' id="value-1" name="value-radio"/>
                            <span>Timeline</span>
                    </label>
                    <label onClick={() => setParamSelection('about')}>
                        <input type="radio" id="value-2" name="value-radio"/>
                            <span>About</span>
                    </label>
                    <label onClick={() => setParamSelection('friends')}>
                        <input type="radio" id="value-3" name="value-radio"/>
                            <span>Friends</span>
                    </label>
                </div>
            </div>
        </div>
    )
}