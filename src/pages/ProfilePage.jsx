import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import logo from '../assets/img/keytick-high-resolution-logo2.png'
import { onAuthStateChanged } from "firebase/auth"
import { getDoc, doc, query, where, collection, getDocs } from "firebase/firestore"
import { auth, db } from "../config/firebase"
import '../styles/profilePage/style.css'

export const ProfilePage = () => {

    const [uid, setUid] = useState(null);
    const [userData, setUserData] = useState()
    const [userPosts, setUserPosts] = useState([])

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

    useEffect(() => {
        const fetchUserPosts = async (userId) => {
            const q = query(
                collection(db, "posts"),
                where("userId", "==", userId)
            );

            const querySnapshot = await getDocs(q);

            setUserPosts(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
        };
        fetchUserPosts(uid)
    }, [uid])
    if(!userData){
        return(
            <div className="pageLoading">
                <div className="loader"></div>
            </div>
        )
    } else return (
        <div className="profilePageWrapper">
            {userData && <Header logo={logo} userData={userData} />}
            <div className="main">

            </div>
        </div>
    )
}