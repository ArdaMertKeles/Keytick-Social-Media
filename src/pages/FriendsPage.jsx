import { useEffect, useState } from "react"
import { Header } from "../components/Header"
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import logo from '../assets/img/keytick-high-resolution-logo2.png'
import '../styles/friendsPage/style.css'
import { FriendRequest } from "../components/friendsPage/FriendRequest";

export const FriendsPage = () => {

    const [uid, setUid] = useState()
    const [userData, setUserData] = useState()
    const [friends, setFriends] = useState()
    const [friendRequests, setFriendRequests] = useState()

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

        const getUserFriends = async () => {
            if (!uid) return;
            const userRef = doc(db, "users", uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setFriends(userSnap.data().friends || []);
            }
        };

        const getUserFriendRequests = async () => {
            if (!uid) return;
            const userRef = doc(db, "users", uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setFriendRequests(userSnap.data().friendRequests || []);
            }
        };

        getUserFriendRequests();
        getUserFriends()
        fetchUserData();
    }, [uid]);

    const getUserFriends = async () => {
        if (!uid) return;
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            setFriends(userSnap.data().friends || []);
        }
    };

    const getUserFriendRequests = async () => {
        if (!uid) return;
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            setFriendRequests(userSnap.data().friendRequests || []);
        }
    };

    if (!userData) {
        return (
            <div className="pageLoading">
                <div className="loader"></div>
            </div>
        )
    } else return (
        <div className="friendsPageWrapper">
            {userData && <Header logo={logo} userData={userData} />}
            <div className="main">
                <div className="friendRequestsContainer">
                    <p className="headerText">Friend Requests</p>
                    <div className="requests">
                        {friendRequests.map((request) => (
                            <FriendRequest request={request} uid={uid} userData={userData} getUserFriendRequests={getUserFriendRequests} getUserFriends={getUserFriends} />
                        ))}
                    </div>
                </div>
                <div className="friendsContainer">
                    <p className="headerText">Friends</p>
                </div>
            </div>
        </div>
    )
}