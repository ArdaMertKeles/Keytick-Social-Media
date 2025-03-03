import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../config/firebase';
import { useState } from 'react';


export const About = ({ userData, uid }) => {

    const [aboutContent, setAboutContent] = useState(userData.about)
    const [about, setAbout] = useState(true)

    const date = new Date(userData.createdAt.seconds * 1000);
    const formattedDate = date.toLocaleDateString("en-EN", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const updateAbout = async () => {
        if (aboutContent !== '') {
            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, {
                about: aboutContent
            });
            setAbout(true)
        }
    }

    return (
        <div className="aboutWrapper">
            <div className="createdAt">
                <p>Member since</p>
                <p>{formattedDate}</p>
            </div>
            <div className="aboutContainer">
                <p className="about">About</p>
                {about === true && <div className='aboutContent'>{aboutContent ? aboutContent : "You don't have an about yet"} <EditIcon onClick={() => setAbout(false)} /></div>}
                {about === false && <div className='changeAbout'>
                    <input type="text" onChange={(e) => setAboutContent(e.target.value)} maxLength={150} placeholder="Write about yourself" value={aboutContent} />
                    <CheckIcon onClick={updateAbout} />
                </div>}
            </div>
        </div>
    )
}