import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const Notification = ({ notif }) => {

    const navigate = useNavigate()

    function capitalizeFirstLetter(val) {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    const timeFormatter = (time) => {
        const date = new Date(time * 1000);
        const timeAgo = formatDistanceToNow(date, { addSuffix: true });

        return capitalizeFirstLetter(timeAgo)
    }

    const NotifType = () => {
        if (notif.content === 'joined') {
            return (
                <div className="notificationContainer joined">
                    <img onClick={() => navigate(`/profile/${notif.uid}`)} src={notif.userPicture} alt="" />
                    <div className="details">
                        <div className="content"><p className='username' onClick={() => navigate(`/profile/${notif.uid}`)}>{notif.username}</p> joined to Keytick!</div>
                        <p className="createdAt">{timeFormatter(notif.createdAt.seconds)}</p>
                    </div>
                </div>
            )
        } else if (notif.content === 'friend') {
            return (
                <div className="notificationContainer friend">
                    <div className='leftContainer'>
                        <img onClick={() => navigate(`/profile/${notif.uid}`)} src={notif.userPicture} alt="" />
                        <div className="details">
                            <div className="content"><p className='username' onClick={() => navigate(`/profile/${notif.uid}`)}>{notif.username}</p> add <p className='username' onClick={() => navigate(`/profile/${notif.friendUid}`)}>{notif.friendUsername}</p> as friend!</div>
                            <p className="createdAt">{timeFormatter(notif.createdAt.seconds)}</p>
                        </div>
                    </div>
                    <img onClick={() => navigate(`/profile/${notif.friendUid}`)} src={notif.friendPicture} alt="" />
                </div>
            )
        } else if (notif.content === 'post') {
            return (
                <div className="notificationContainer post">
                    <div className='leftContainer'>
                        <img onClick={() => navigate(`/profile/${notif.uid}`)} src={notif.userPicture} alt="" />
                        <div className="details">
                            <div className="content"><p className='username' onClick={() => navigate(`/profile/${notif.uid}`)}>{notif.username}</p> created a post!</div>
                            <p className="createdAt">{timeFormatter(notif.createdAt.seconds)}</p>
                        </div>
                    </div>
                    {notif.image && <img src={notif.image} alt="" />}
                </div>
            )
        }
    }

    return (
        <NotifType />
    )
}