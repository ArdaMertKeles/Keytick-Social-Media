import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from "date-fns";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db } from '../../config/firebase';

export const Post = ({ post, friends, userData }) => {

    const [liked, setLiked] = useState(false);
    const [comment, setComment] = useState('')

    const user = userData

    const date = new Date(post.createdAt.seconds * 1000);
    const timeAgo = formatDistanceToNow(date, { addSuffix: true });

    const likes = post.likes
    const firstUser = likes[0]?.username
    const remainingLikes = likes.length - 1

    function capitalizeFirstLetter(val) {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    const toggleLike = async (postId, user) => {
        const postRef = doc(db, "posts", postId);

        try {
            const postSnap = await getDoc(postRef);
            if (!postSnap.exists()) return;

            const postData = postSnap.data();
            const likedByUser = postData.likes?.some(like => like.uid === user.uid);

            if (likedByUser) {
                await updateDoc(postRef, {
                    likes: arrayRemove({
                        uid: user.uid,
                        username: user.username,
                        profilePicture: user.profilePicture,
                    }),
                });
            } else {
                await updateDoc(postRef, {
                    likes: arrayUnion({
                        uid: user.uid,
                        username: user.username,
                        profilePicture: user.profilePicture,
                    }),
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setLiked(post.likes?.some(like => like.uid === user.uid));
    }, [post.likes, user.uid]);

    const handleLike = async () => {
        await toggleLike(post.id, user);
        setLiked(!liked);
    };

    return (
        <div className="postWrapper">
            <div className="postContainer">
                <div className="headerContainer">
                    <img src={post.userPicture} alt="" />
                    <div className="details">
                        <div className="nameDetails">
                            <p className="username">{post.username}</p>
                            {friends.includes(post.userId) && <span><ArrowRightIcon /> Your Friend</span>}
                        </div>
                        <p className="createdAt">{capitalizeFirstLetter(timeAgo)}</p>
                    </div>
                </div>
                <div className="contentContainer">
                    <p className="content">{post.content}</p>
                    {post.image && <img src={post.image} alt="" />}
                </div>
                <div className="btnContainer">
                    <button className={liked ? "liked" : "like"} onClick={handleLike}><ThumbUpAltIcon /> {liked ? "Liked" : "Like"}</button>
                    <label htmlFor='comment'><ChatBubbleIcon /> Comment</label>
                </div>
            </div>
            <div className="commentsContainer">
                <div className="likesContainer">
                    <p className="likeAmount"><ThumbUpAltIcon /> {likes.length === 0 ? 'No likes yet' : remainingLikes > 0 ? `${firstUser} and ${remainingLikes} others liked` : `${firstUser} liked this`}</p>
                </div>
                <div className="comments">
                    <div className="commentContainer">
                        <img src={userData.profilePicture} alt="" />
                        <div className="detailContainer">
                            <div className="details">
                                <div className="username">{userData.username}</div>
                                <div className="content">It's awesome!</div>
                            </div>
                            <p className="createdAt">Yesterday</p>
                        </div>
                    </div>
                    <div className="commentContainer">
                        <img src={userData.profilePicture} alt="" />
                        <div className="detailContainer">
                            <div className="details">
                                <div className="username">{userData.username}</div>
                                <div className="content">It's awesome!</div>
                            </div>
                            <p className="createdAt">Yesterday</p>
                        </div>
                    </div>
                </div>
                <form className="postComment">
                    <img src={userData.profilePicture} alt="" />
                    <input type="text" id='comment' placeholder='Write a comment...' />
                </form>
            </div>
        </div>
    )
}