import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { UserCard } from "../components/searchPage/UserCard";
import { Header } from "../components/Header";
import { onAuthStateChanged } from "firebase/auth";
import logo from '../assets/img/keytick-high-resolution-logo2.png'
import '../styles/searchPage/style.css'

export const SearchPage = () => {

    const { searchTerm } = useParams();
    const [results, setResults] = useState([]);
    const [userData, setUserData] = useState()
    const [uid, setUid] = useState()

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
        const fetchResults = async () => {
            try {
                const q = query(
                    collection(db, "users"),
                    where("username", ">=", searchTerm),
                    where("username", "<=", searchTerm + "\uf8ff")
                );
                const snapshot = await getDocs(q);
                const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setResults(users);
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        };
        fetchResults();
    }, [searchTerm]);

    if (!userData) {
        return (
            <div className="pageLoading">
                <div className="loader"></div>
            </div>
        )
    } else return (
        <div className="searchPageWrapper">
            <Header logo={logo} userData={userData} />
            <div className="searchResults">
                <p className="results">Results for "{searchTerm}"</p>
                {results.length > 0 ? (
                    results.map((user) => <UserCard key={user.id} user={user} />)
                ) : (
                    <p>No users found.</p>
                )}
            </div>
        </div>
    )
};