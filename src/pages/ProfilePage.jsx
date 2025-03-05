import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Header } from "../components/Header"
import logo from '../assets/img/keytick-high-resolution-logo2.png'
import BrowserNotSupportedIcon from '@mui/icons-material/BrowserNotSupported';
import { onAuthStateChanged } from "firebase/auth"
import { getDoc, doc, query, where, collection, getDocs } from "firebase/firestore"
import { auth, db } from "../config/firebase"
import '../styles/profilePage/style.css'
import { ProfileSection } from "../components/profilePage/ProfileSection"
import { Post } from "../components/Post"
import { About } from "../components/profilePage/About";

export const ProfilePage = () => {

    const [uid, setUid] = useState(null);
    const [userData, setUserData] = useState()
    const [profileData, setProfileData] = useState()
    const [friends, setFriends] = useState()
    const [userPosts, setUserPosts] = useState([])
    const [paramSelection, setParamSelection] = useState('timeline')

    const navigate = useNavigate()
    const profileUid = useParams()

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

        getUserFriends()
        fetchUserData();
    }, [uid]);

    const fetchUserPosts = async () => {
        const q = query(
            collection(db, "posts"),
            where("userId", "==", profileUid.profileId)
        );

        const querySnapshot = await getDocs(q);

        setUserPosts(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    };

    useEffect(() => {
        const fetchUserPosts = async (userId) => {
            const q = query(
                collection(db, "posts"),
                where("userId", "==", userId)
            );

            const querySnapshot = await getDocs(q);

            setUserPosts(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
        };

        const fetchProfileData = async (userId) => {
            try {
                const userDoc = await getDoc(doc(db, "users", userId));
                setProfileData(userDoc.data());
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }

        fetchUserPosts(profileUid.profileId)
        fetchProfileData(profileUid.profileId)
    }, [profileUid])

    const fetchProfileData = async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, "users", userId));
            setProfileData(userDoc.data());
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    if (!userData) {
        return (
            <div className="pageLoading">
                <div className="loader"></div>
            </div>
        )
    } else return (
        <div className="profilePageWrapper">
            {userData && <Header logo={logo} userData={userData} />}
            <div className="main">
                {profileData && <ProfileSection userData={userData} fetchProfileData={fetchProfileData} setParamSelection={setParamSelection} profileData={profileData} friends={friends} uid={uid} />}
                {paramSelection === 'timeline' && userPosts.map((post) => (
                    <Post key={post.id} getPosts={fetchUserPosts} post={post} friends={friends} userData={userData} />
                ))}
                {paramSelection === 'about' && <About userData={userData} uid={uid} />}
                {paramSelection === 'timeline' && userPosts.length === 0 && <div className="noPosts">This user has not shared any post yet <BrowserNotSupportedIcon /></div>}
            </div>
        </div>
    )
}