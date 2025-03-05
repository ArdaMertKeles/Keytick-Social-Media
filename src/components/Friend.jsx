import { useNavigate } from "react-router-dom"

export const Friend = ({ friend }) => {

    const navigate = useNavigate()

    return (
        <div className="friendContainer">
            <div className="details">
                <img onClick={() => navigate(`/profile/${friend.uid}`)} src={friend.profilePicture} alt="" />
                <p onClick={() => navigate(`/profile/${friend.uid}`)} className="name">{friend.username}</p>
            </div>
        </div>
    )
}