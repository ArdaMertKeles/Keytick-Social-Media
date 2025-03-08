import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { getDoc, doc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import logo from '../assets/img/keytick-high-resolution-logo2.png'
import { Header } from "../components/Header";
import { Notification } from "../components/notificationsPage/Notification";
import '../styles/notificationPage/style.css'

export const NotificationsPage = () => {

    const [uid, setUid] = useState()
    const [userData, setUserData] = useState()
    const [notifications, setNotifications] = useState()

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

        const fetchHomePosts = async () => {
            const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        };

        const getPosts = async () => {
            const notifList = await fetchHomePosts();
            setNotifications(notifList);
        };

        getPosts()
        fetchUserData();
    }, [uid]);


    if (!userData) {
        return (
            <div className="pageLoading">
                <div className="loader"></div>
            </div>
        )
    } else return (
        <div className='notificationsPageWrapper'>
            <Header logo={logo} userData={userData} />
            <div className="notificationsWrapper">
                <p className="headerText">Notifications</p>
                {notifications.map((notif, key) => (
                    <Notification key={key} notif={notif} />
                ))}
            </div>
        </div>
    )
}