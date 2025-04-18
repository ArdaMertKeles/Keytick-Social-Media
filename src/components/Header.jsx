import { Link, useNavigate } from "react-router-dom"
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HelpIcon from '@mui/icons-material/Help';
import GroupIcon from '@mui/icons-material/Group';
import { useState } from "react";

export const Header = ({ logo, userData }) => {

    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault();
        if(searchTerm !== ''){
            if (searchTerm.trim()) {
                navigate(`/search/${searchTerm}`);
                setSearchTerm("");
            }
        }
    };

    return (
        <div className='header'>
            <div className='leftContainer'>
                <img draggable='false' src={logo} alt="" onClick={() => navigate('/')} />
                <form className="searchDiv">
                    <input onChange={(e) => setSearchTerm(e.target.value)} type="text" id="search" placeholder="Search for users..." className="searchBar" />
                    <label htmlFor="search"><SearchIcon /></label>
                    <button type="submit" onClick={handleSearch}></button>
                </form>
            </div>
            <div className="rightContainer">
                {userData && <div onClick={() => navigate(`/profile/${userData.uid}`)} className="profileBox">
                    <img src={userData.profilePicture} alt="" />
                    <p>{userData.username}</p>
                </div>}
                <div className="divider"></div>
                <Link to={'/home'} className="link">Home</Link>
                <div className="divider"></div>
                <Link to={'/create'} className="link">Create</Link>
                <div className="divider"></div>
                <Link to={'/chat'} className="link">Chat</Link>
                <div className="divider"></div>
                <GroupIcon onClick={() => navigate('/friends')} />
                <NotificationsIcon onClick={() => navigate('/notifications')} />
                <div className="divider"></div>
                <HelpIcon onClick={() => navigate('/faq')} />
            </div>
        </div>
    )
}