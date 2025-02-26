import { Link } from "react-router-dom"
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HelpIcon from '@mui/icons-material/Help';
import GroupIcon from '@mui/icons-material/Group';

export const Header = ({ logo, userData }) => {
    return (
        <div className='header'>
            <div className='leftContainer'>
                <img draggable='false' src={logo} alt="" />
                <div className="searchDiv">
                    <input type="text" id="search" placeholder="Search" className="searchBar" />
                    <label htmlFor="search"><SearchIcon /></label>
                </div>
            </div>
            <div className="rightContainer">
                {userData && <div className="profileBox">
                    <img src={userData.profilePicture} alt="" />
                    <p>{userData.username}</p>
                </div>}
                <div className="divider"></div>
                <Link className="link">Home</Link>
                <div className="divider"></div>
                <Link className="link">Create</Link>
                <div className="divider"></div>
                <GroupIcon />
                <NotificationsIcon />
                <div className="divider"></div>
                <HelpIcon />
            </div>
        </div>
    )
}