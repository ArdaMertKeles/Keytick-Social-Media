import { useState, useEffect } from "react"
import '../styles/authPage/style.css'
import { auth, googleProvider, db } from "../config/firebase"
import { setDoc, doc, addDoc, collection, Timestamp, getDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { ForgotPassword } from "../components/authPage/ForgotPassword";

export const AuthPage = () => {

    const [isSignUp, setIsSignUp] = useState(false)
    const [password, setPassword] = useState()
    const [email, setEmail] = useState()
    const [name, setName] = useState('')

    const [forgotPass, setForgotPass] = useState(false)
    const [invalidPass, setInvalidPass] = useState(false)
    const [invalidName, setInvalidName] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const navigate = useNavigate()

    const getErrorMessage = (errorCode) => {
        const errorMessages = {
            "auth/invalid-email": "Invalid email address.",
            "auth/user-not-found": "No user found with this email.",
            "auth/wrong-password": "Incorrect password.",
            "auth/email-already-in-use": "This email address is already in use.",
            "auth/weak-password": "Password should be at least 6 characters.",
            "auth/network-request-failed": "Check your internet connection.",
        };

        return errorMessages[errorCode] || "An unknown error occurred.";
    };

    const signUp = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            setInvalidPass(true);
            return;
        }
        if(name.length <3){
            setInvalidName(true);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                username: name,
                email: user.email,
                profilePicture: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png',
                bio: '',
                about: '',
                friendRequests: [],
                friends: [],
                createdAt: new Date()
            });

            try {
                await addDoc(collection(db, "notifications"), {
                    username: name,
                    userPicture: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png',
                    uid: user.uid,
                    content: 'joined',
                    createdAt: Timestamp.now(),
                });
            } catch (error) {
                console.error(error);
            }

            setPassword('');
            setEmail('');
            setName('');

        } catch (err) {
            setErrorMsg(getErrorMessage(err.code));
            setTimeout(() => {
                setErrorMsg('')
            }, 2500);
            setPassword('');
            setEmail('');
            setName('');
        }
    };

    const signWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const userDocRef = doc(db, "users", user.uid);
            const userSnapshot = await getDoc(userDocRef);

            if (!userSnapshot.exists()) {
                await setDoc(userDocRef, {
                    uid: user.uid,
                    username: user.displayName || 'Unknown User',
                    email: user.email || 'No Email',
                    profilePicture: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png',
                    bio: '',
                    about: '',
                    friendRequests: [],
                    friends: [],
                    createdAt: new Date(),
                });

                await setDoc(doc(db, "notifications", user.uid), {
                    username: user.displayName || 'Unknown User',
                    userPicture: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png',
                    uid: user.uid,
                    content: 'joined',
                    createdAt: new Date(),
                });
            }

        } catch (err) {
            console.error("Google sign-in error:", err);
            setErrorMsg(getErrorMessage(err.code));
            setTimeout(() => {
                setErrorMsg('');
            }, 2500);
        }
    };

    const signIn = async (e) => {
        e.preventDefault()
        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate('/home')
        } catch (err) {
            setErrorMsg(getErrorMessage(err.code));
            setTimeout(() => {
                setErrorMsg('')
            }, 2500);
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                navigate('/home')
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    return (
        <div className="authPageWrapper">
            <h1>Keytick</h1>
            {!isSignUp && !forgotPass && <div className="signInContainer">
                <p className="tag">Sign In Keytick</p>
                <form action="">
                    <input type="email" required={true} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" />
                    <input type="password" required={true} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />
                    <input className="submit" onClick={(e) => signIn(e)} type="submit" value={'Sign In'} />
                    <button type="button" className="login-with-google-btn" onClick={signWithGoogle} >Sign in with Google</button>
                    {!errorMsg !== '' && <p className="invalid">{errorMsg}</p>}
                    </form>
                <div className="container">
                    <p onClick={() => setForgotPass(true)}>Forget your password?</p>
                    <p onClick={() => { setIsSignUp(true); setEmail(''); setPassword(''); setName(''); setInvalidPass(false); setInvalidName(false) }}>Sign Up Keytick</p>
                </div>
            </div>}
            {isSignUp && !forgotPass && <div className="signUpContainer">
                <p className="tag">Sign Up Keytick</p>
                <form action="">
                    <input type="text" required={true} max={25} onChange={(e) => setName(e.target.value)} value={name} placeholder="Your name" />
                    <input type="email" required={true} onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Your email" />
                    <input type="password" required={true} onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Your password" />
                    {invalidPass && <p className="invalid">Password must be at least 6 characters</p>}
                    {invalidName && <p className="invalid">Name must be at least 3 characters</p>}
                    {!errorMsg !== '' && <p className="invalid">{errorMsg}</p>}
                    <input className="submit isSign" onClick={(e) => signUp(e)} type="submit" value={'Sign Up'} />
                </form>
                <div className="container isSign">
                    <p onClick={() => { setIsSignUp(false); setEmail(''); setPassword(''); setName(''); setInvalidPass(false); setInvalidName(false) }}>Sign In Keytick</p>
                </div>
            </div>}
            {forgotPass && <ForgotPassword setForgotPass={setForgotPass} />}
        </div>
    )
}