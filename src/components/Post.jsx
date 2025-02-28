import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from "date-fns";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, Timestamp, deleteDoc } from "firebase/firestore";
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

export const Post = ({ post, friends, userData, getPosts }) => {

    const [liked, setLiked] = useState(false);
    const [comment, setComment] = useState('')

    const user = userData
    const navigate = useNavigate()

    const timeFormatter = (time) => {
        const date = new Date(time * 1000);
        const timeAgo = formatDistanceToNow(date, { addSuffix: true });

        return capitalizeFirstLetter(timeAgo)
    }

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
            getPosts()
        } catch (error) {
            console.error(error);
        }
    };

    const postComment = async (e) => {
        e.preventDefault()
        const commentId = uuidv4()
        const postRef = doc(db, "posts", post.id);
        try {
            await updateDoc(postRef, {
                comments: arrayUnion({
                    id: commentId,
                    uid: user.uid,
                    username: user.username,
                    profilePicture: user.profilePicture,
                    content: comment,
                    createdAt: Timestamp.now()
                }),
            });
            setComment('')
            getPosts()
        } catch (error) {
            console.error(error)
        }
    }

    const deleteComment = async (commentId) => {
        try {
            const postRef = doc(db, "posts", post.id);
            const postSnapshot = await getDoc(postRef);
            const postData = postSnapshot.data();

            if (!postData || !postData.comments) return;

            const updatedComments = postData.comments.filter(
                (comment) => comment.id !== commentId
            );

            await updateDoc(postRef, { comments: updatedComments });
            getPosts()

        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    useEffect(() => {
        setLiked(post.likes?.some(like => like.uid === user.uid));
    }, [post.likes, user.uid]);

    const handleLike = async () => {
        await toggleLike(post.id, user);
        setLiked(!liked);
    };

    const deletePost = async () => {
        try {
          const postRef = doc(db, "posts", post.id);
          await deleteDoc(postRef);
          getPosts()
        } catch (error) {
          console.error("Error deleting post:", error);
        }
      };

    return (
        <div className="postWrapper">
            <div className="postContainer">
                <div className="headerContainer">
                    <img src={post.userPicture} alt="" />
                    <div className="details">
                        <div className="nameDetails">
                            <p className="username" onClick={() => navigate(`/profile/${post.userId}`)} >{post.username}</p>
                            {friends.includes(post.userId) && <span><ArrowRightIcon /> Your Friend</span>}
                        </div>
                        <p className="createdAt">{timeFormatter(post.createdAt.seconds)}</p>
                    </div>
                    {post.userId === userData.uid && <button className='deleteBtn' onClick={deletePost}><DeleteIcon /></button>}
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
                    {post.comments.map((comment, key) => (
                        <div key={key} className="commentContainer">
                            <img onClick={() => navigate(`/profile/${comment.uid}`)} src={comment.profilePicture} alt="" />
                            <div onClick={() => navigate(`/profile/${comment.uid}`)} className="detailContainer">
                                <div className="details">
                                    <div className="username">{comment.username}</div>
                                    <div className="content">{comment.content}</div>
                                </div>
                                <p className="createdAt">{timeFormatter(comment.createdAt.seconds)}</p>
                            </div>
                            {comment.uid === userData.uid && <button className='deleteBtn' onClick={() => deleteComment(comment.id)}><DeleteIcon /></button>}
                        </div>
                    ))}
                </div>
                <form onSubmit={(e) => postComment(e)} className="postComment">
                    <img src={userData.profilePicture} alt="" />
                    <input type="text" id='comment' onChange={(e) => setComment(e.target.value)} value={comment} placeholder='Write a comment...' />
                </form>
            </div>
        </div>
    )
}