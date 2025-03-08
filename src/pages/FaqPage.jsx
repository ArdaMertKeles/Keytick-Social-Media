import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header"
import logo from '../assets/img/keytick-high-resolution-logo2.png'
import '../styles/faqPage/style.css'
import { Faq } from "../components/faqPage/Faq";

export const FaqPage = () => {

    const [uid, setUid] = useState()
    const [userData, setUserData] = useState()

    const navigate = useNavigate()

    const faqs = [
        {
            faq: 'How do i create a post?',
            answer: "To create a post, simply click the 'Create Post' button on the home or profile page. You can add text, upload images, and share your thoughts with your friends."
        },
        {
            faq: 'How can i add friend?',
            answer: "You can add a friend by visiting their profile and clicking the 'Add Friend' button. Once they accept your request, you'll be able to chat with them."
        },
        {
            faq: 'How do I like or comment on a post?',
            answer: "To like a post, click the thump up icon below it. To comment, click the comment icon and type your message. Your comments will be visible to the post owner and their friends."
        },
        {
            faq: 'How do notifications work?',
            answer: "You’ll receive notifications for new friendships, posts and new members. You can access all your notifications by clicking the notification bell icon on the top menu."
        },
        {
            faq: 'Can I delete my own posts or comments?',
            answer: "Yes, you can delete your own posts and comments by clicking the 'Delete' button next to them. This action is permanent and cannot be undone."
        },
        {
            faq: 'How do I start a chat with a friend?',
            answer: "To start a chat, go to your friend list and click on the chat icon next to your friend's name. This will open a private chat window where you can send and receive messages in real-time."
        }
    ]

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
        <div className='faqPageWrapper'>
            <Header logo={logo} userData={userData} />
            <div className="faqWrapper">
                <div className="faqs">
                    <p className="headerText">Frequently Asked Questions</p>
                    {faqs.map((faq) => (
                        <Faq faq={faq} />
                    ))}
                </div>
            </div>
        </div>
    )
}