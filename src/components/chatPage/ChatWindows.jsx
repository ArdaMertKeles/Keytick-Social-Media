import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

export const ChatWindow = ({ currentUser, selectedFriend }) => {

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const navigate = useNavigate()

    const chatId = [currentUser.uid, selectedFriend.uid].sort().join("_");

    function capitalizeFirstLetter(val) {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    const timeFormatter = (time) => {
        const date = new Date(time * 1000);
        const timeAgo = formatDistanceToNow(date, { addSuffix: true });

        return capitalizeFirstLetter(timeAgo)
    }

    useEffect(() => {
        if (selectedFriend) {
            const q = query(collection(db, `chats/${chatId}/messages`), orderBy("timestamp"));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedMessages = snapshot.docs.map(doc => doc.data());
                setMessages(fetchedMessages);
            });
            return () => unsubscribe();
        }
    }, [selectedFriend, chatId]);

    const sendMessage = async (e) => {
        e.preventDefault()
        if (newMessage.trim()) {
            await addDoc(collection(db, `chats/${chatId}/messages`), {
                senderUid: currentUser.uid,
                text: newMessage,
                timestamp: serverTimestamp(),
                id: uuidv4()
            });
            setNewMessage("");
        }
    };

    return (
        <div className="chatWindow">
            <div className="friendDetails">
                <img onClick={() => navigate(`/profile/${selectedFriend.uid}`)} src={selectedFriend.profilePicture} alt="" />
                <p onClick={() => navigate(`/profile/${selectedFriend.uid}`)}>{selectedFriend.username}</p>
            </div>
            <div className="messages">
                {messages.map(msg => (
                    <div key={msg.id} className={msg.senderUid === currentUser.uid ? "sent" : "received"}>
                        <p>{msg.text}</p> <p className="createdAt">
                            {msg.timestamp?.seconds
                                ? timeFormatter(msg.timestamp.seconds)
                                : "Sending..."}
                        </p>
                    </div>
                ))}
            </div>
            <form action="" className="sendMsg">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    maxLength={50}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
            </form>
        </div>
    );
};