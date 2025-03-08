import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header"
import logo from '../assets/img/keytick-high-resolution-logo2.png'
import { FriendsList } from "../components/chatPage/FriendsList";
import { ChatWindow } from "../components/chatPage/ChatWindows";
import '../styles/chatPage/style.css'

export const ChatPage = () => {

    const [uid, setUid] = useState()
    const [userData, setUserData] = useState()
    const [selectedFriend, setSelectedFriend] = useState(null);

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

    if (!userData) {
        return (
            <div className="pageLoading">
                <div className="loader"></div>
            </div>
        )
    } else return (
        <div className='chatPageWrapper'>
            <Header logo={logo} userData={userData} />
            <div className="chatWrapper">
                <FriendsList selectFriend={setSelectedFriend} uid={uid} />
                {selectedFriend ? (<ChatWindow currentUser={userData} selectedFriend={selectedFriend} />) : (<div className="selectChat">Select a friend to start chatting!</div>)}
            </div>
        </div>
    )
}