import { getDoc, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import { Header } from '../components/Header';
import logo from '../assets/img/keytick-high-resolution-logo2.png'
import { CreatePost } from '../components/homePage/CreatePost';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/createPage/style.css'

export const CreatePage = () => {

    const [uid, setUid] = useState()
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
                    setUserData(userDoc.data());
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [uid]);

    if(!userData){
        return(
            <div className="pageLoading">
                <div className="loader"></div>
            </div>
        )
    } else return (
        <div className='createPageWrapper'>
            <Header logo={logo} userData={userData} />
            <CreatePost userData={userData} />
        </div>
    )
}