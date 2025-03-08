import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

export const FriendsList = ({ selectFriend, uid }) => {
    
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const getUserFriends = async () => {
            const userRef = doc(db, "users", uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setFriends(userSnap.data().friends || []);
            }
        };

        getUserFriends()
    }, [uid]);

    return (
        <form className="friendsList">
            {friends.map(friend => (
                <div key={friend.uid} className="friend">
                    <input type="radio" name="friend" id={friend.uid} />
                    <label htmlFor={friend.uid} key={friend.uid} onClick={() => selectFriend(friend)} >
                        <img src={friend.profilePicture} alt={friend.username} />
                        <p>{friend.username}</p>
                    </label>
                </div>
            ))}
        </form>
    );
};