import React, { useContext } from 'react';
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { AuthContext } from '../../Firebase/Provider/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { browserLocalPersistence } from 'firebase/auth';


const SocialLogin = () => {
    const { signInWithGoogle, signInWithGithub, signInWithFacebook } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleGoogle = async () => {
        try {
            await signInWithGoogle(browserLocalPersistence);
            navigate('/');
        } catch (err) {
            console.error('Google social login failed', err);
        }
    };

    const handleGithub = async () => {
        try {
            await signInWithGithub(browserLocalPersistence);
            navigate('/');
        } catch (err) {
            console.error('GitHub social login failed', err);
        }
    };

    const handleFacebook = async () => {
        try {
            await signInWithFacebook(browserLocalPersistence);
            navigate('/');
        } catch (err) {
            console.error('Facebook social login failed', err);
        }
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-blue-900/30 shadow-lg">
            <h2 className='font-bold mb-5 text-blue-400 flex items-center gap-2'>
                <span>🔐</span> Login With
            </h2>
                        <div className='space-y-3'>
                                <button onClick={handleGoogle} className='h-11 w-full rounded-xl bg-white text-slate-800 font-medium flex items-center justify-center gap-3'>
                                    <FcGoogle size={20} />
                                    <span>Google</span>
                                </button>

                                <button onClick={handleGithub} className='h-11 w-full rounded-xl bg-gray-800 text-white font-medium flex items-center justify-center gap-3'>
                                    <FaGithub size={18} />
                                    <span>Github</span>
                                </button>

                                <button onClick={handleFacebook} className='h-11 w-full rounded-xl bg-blue-700 text-white font-medium flex items-center justify-center gap-3'>
                                    <FaFacebook size={18} />
                                    <span>Facebook</span>
                                </button>
                        </div>
        </div>
    );
};

export default SocialLogin;