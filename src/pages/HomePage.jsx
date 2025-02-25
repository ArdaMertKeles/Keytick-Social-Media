import { useNavigate } from 'react-router-dom'
import logo from '../assets/img/keytick-high-resolution-logo2.png'
import { Header } from '../components/homePage/Header'
import '../styles/homePage/styles.css'
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from "../config/firebase";
import { getDoc, doc } from 'firebase/firestore'
import { CreatePost } from '../components/homePage/CreatePost'

export const HomePage = () => {

    const [uid, setUid] = useState(null);
    const [userData, setUserData] = useState()

    const navigate = useNavigate()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate("/");
            } else {
                setUid(user.uid);
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!uid) return;
            try {
                const userDoc = await getDoc(doc(db, "users", uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [uid]);

    return(
        <div className='homePage'>
            <Header logo={logo} userData={userData} />
            <div className="main">
                <CreatePost userData={userData} />
            </div>
        </div>
    )
}