import { useNavigate } from 'react-router-dom'
import logo from '../assets/img/keytick-high-resolution-logo2.png'
import { Header } from '../components/Header'
import '../styles/homePage/styles.css'
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from "../config/firebase";
import { getDoc, doc, collection, query, orderBy, getDocs } from 'firebase/firestore'
import { CreatePost } from '../components/homePage/CreatePost'
import { Post } from '../components/Post'

export const HomePage = () => {

    const [uid, setUid] = useState(null);
    const [userData, setUserData] = useState()
    const [friends, setFriends] = useState([])
    const [posts, setPosts] = useState([])

    const user = auth.currentUser
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

    const fetchHomePosts = async () => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    };

    const getPosts = async () => {
        const postList = await fetchHomePosts();
        setPosts(postList);
    };

    useEffect(() => {
        const getPosts = async () => {
            const postList = await fetchHomePosts();
            setPosts(postList);
        };

        const getUserFriends = async () => {
            if (!user) return;
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setFriends(userSnap.data().friends || []);
            }
        };

        getPosts();
        getUserFriends()
    }, [user])

    if(!userData){
        return(
            <div className="pageLoading">
                <div className="loader"></div>
            </div>
        )
    } else return (
        <div className='homePage'>
            <Header logo={logo} userData={userData} />
            <div className="main">
                <CreatePost userData={userData} getPosts={getPosts} />
                {posts.map((post) => (
                    <Post key={post.id} getPosts={getPosts} post={post} friends={friends} userData={userData} />
                ))}
            </div>
        </div>
    )
}