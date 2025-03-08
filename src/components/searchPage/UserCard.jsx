import { useNavigate } from "react-router-dom"

export const UserCard = ({ user }) => {

    const navigate = useNavigate()

    return (
        <div onClick={() => navigate(`/profile/${user.uid}`)} className="userCard">
            <img src={user.profilePicture} alt={user.username} />
            <div className="details">
                <p className="username">{user.username}</p>
                <p className="bio">{user.bio}</p>
            </div>
        </div>
    )
}