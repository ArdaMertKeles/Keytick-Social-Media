import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import LoupeIcon from '@mui/icons-material/Loupe';
import EmojiPicker from 'emoji-picker-react';
import { useState } from 'react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

export const CreatePost = ({ userData, getPosts }) => {

    const [emojiPicker, setEmojiPicker] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null);
    const [content, setContent] = useState('')

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const base64Image = await convertToBase64(file);
            setSelectedImage(base64Image);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content && !selectedImage) return;
        setDisabled(true)
        await sharePost(userData.uid, content, selectedImage);
        setContent("");
        setSelectedImage(null);
        setDisabled(false)
    };

    const sharePost = async (userId, content, imageBase64) => {
        try {
            await addDoc(collection(db, "posts"), {
                username: userData.username,
                userPicture: userData.profilePicture,
                userId,
                content,
                image: imageBase64,
                likes: [],
                comments: [],
                createdAt: Timestamp.now(),
            });
            if (getPosts) {
                getPosts()
            }
            try {
                await addDoc(collection(db, "notifications"), {
                    username: userData.username,
                    userPicture: userData.profilePicture,
                    userId,
                    content: 'post',
                    image: imageBase64,
                    createdAt: Timestamp.now(),
                });
            } catch (error) {
                console.error(error);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="createPostContainer">
            <div className="headerContainer">
                <p>Create Post</p>
            </div>
            {userData && <div className="textContainer">
                <img src={userData.profilePicture} alt="" />
                <textarea placeholder={`What's on your mind, ${userData.username}?`} name="" id="" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
            </div>}
            <div className="btnContainer">
                <div className="attachments">
                    <label htmlFor="photo">
                        <div className='photoBtn'><InsertPhotoIcon />Photo</div>
                    </label>
                    <input type="file" accept="image/*" onChange={handleFileChange} name="photo" id="photo" />
                    <div className="emoji">
                        <button onClick={() => setEmojiPicker(!emojiPicker)}><EmojiEmotionsIcon /> Emoji</button>
                        <EmojiPicker className='emojiPicker' open={emojiPicker} theme='dark' onEmojiClick={(e) => { setEmojiPicker(false); setContent(prev => prev + e.emoji) }} />
                    </div>
                </div>
                <button disabled={disabled} onClick={handleSubmit} className='postBtn'><LoupeIcon /> Post</button>
            </div>
        </div>
    )
}