import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Firebase/Provider/AuthProvider";
import { getAuth, sendPasswordResetEmail, GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import app from "../Firebase/Firebase.config";

const Login = () => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [remember, setRemember] = useState(true);
  const [emailValue, setEmailValue] = useState("");
  const { signIn } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth(app);

  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

  const mapAuthError = (code) => {
    if (!code) return 'Authentication failed';
    // common Firebase auth error codes -> friendly messages
    const map = {
      'auth/invalid-email': 'Invalid email address',
      'auth/operation-not-allowed': 'This sign-in method is not enabled. Enable it in Firebase Console → Authentication → Sign-in method.',
      'auth/invalid-credential': 'Invalid credentials',
      'auth/wrong-password': 'Invalid credentials',
      'auth/user-not-found': 'Invalid credentials',
      'auth/user-disabled': 'Your account has been disabled',
      'auth/too-many-requests': 'Too many attempts — try again later',
      'auth/network-request-failed': 'Network error — check your connection',
      'auth/popup-closed-by-user': 'Sign-in cancelled',
      'auth/account-exists-with-different-credential': 'Account exists with different sign-in method',
    };
    return map[code] || code.replace('auth/', '').replace(/-/g, ' ');
  };

  const handleGoogleSignIn = async () => {
    try {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      const result = await signInWithPopup(auth, googleProvider);
      if (remember && result?.user?.email) localStorage.setItem('rememberEmail', result.user.email);
      navigate(location.state?.from || '/');
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError(mapAuthError(err.code));
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      const result = await signInWithPopup(auth, githubProvider);
      if (remember && result?.user?.email) localStorage.setItem('rememberEmail', result.user.email);
      navigate(location.state?.from || '/');
    } catch (err) {
      console.error('GitHub sign-in error:', err);
      setError(mapAuthError(err.code));
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      const result = await signInWithPopup(auth, facebookProvider);
      if (remember && result?.user?.email) localStorage.setItem('rememberEmail', result.user.email);
      navigate(location.state?.from || '/');
    } catch (err) {
      console.error('Facebook sign-in error:', err);
      setError(mapAuthError(err.code));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const form = e.target;
    const email = emailValue || form.email.value;
    const password = form.password.value;

    try {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      const result = await signIn(email, password);
      if (remember) localStorage.setItem('rememberEmail', email);
      else localStorage.removeItem('rememberEmail');
      navigate(location.state?.from || "/");
    } catch (err) {
      console.error('Login error:', err);
      setError(mapAuthError(err.code));
    }
  };

  const handleForgotPassword = async () => {
    const email = prompt("Please enter your registered email:");
    if (!email) return alert("Email is required!");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
      setError("");
    } catch (err) {
      console.error('Password reset error:', err);
      setError(mapAuthError(err.code));
    }
  };

  useEffect(() => {
    try {
      const remembered = localStorage.getItem('rememberEmail');
      if (remembered) setEmailValue(remembered);
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-5xl bg-transparent rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

        {/* Left branding panel */}
          <div className="relative hidden lg:flex flex-col justify-center items-start p-12 bg-gradient-to-br from-blue-700 via-indigo-800 to-black text-white">
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">NewsCloud</h1>
          <p className="text-sm text-blue-100/90 mb-6">Curated headlines, fast summaries, and reliable sources — all in one place.</p>

          <div className="space-y-4 w-full">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">📰</div>
              <div>
                <div className="text-sm font-semibold">Latest Coverage</div>
                <div className="text-xs text-blue-200/80">Top stories from trusted sources</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">⚡</div>
              <div>
                <div className="text-sm font-semibold">Fast Summaries</div>
                <div className="text-xs text-blue-200/80">Get the gist in seconds</div>
              </div>
            </div>
          </div>

          <svg className="absolute -right-20 bottom-0 opacity-30" width="300" height="300" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="g" x1="0" x2="1">
                <stop offset="0%" stopColor="#60A5FA"/>
                <stop offset="100%" stopColor="#7C3AED"/>
              </linearGradient>
            </defs>
            <circle cx="80" cy="120" r="80" fill="url(#g)" />
          </svg>
        </div>

        {/* Right form panel */}
        <div className="bg-black/40 backdrop-blur-md p-8 md:p-10 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
            <p className="text-sm text-blue-200 mb-6">Sign in to continue to NewsCloud</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <div className="flex items-center gap-3 bg-gray-800/40 rounded-xl p-2 border border-gray-700/30 focus-within:ring-2 focus-within:ring-blue-400">
                  <span className="px-3 text-sm text-blue-200">Email</span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={emailValue}
                    onChange={(e) => setEmailValue(e.target.value)}
                    placeholder="you@domain.com"
                    className="bg-transparent w-full text-white placeholder-blue-200/70 outline-none px-2 py-3"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="flex items-center gap-3 bg-gray-800/40 rounded-xl p-2 border border-gray-700/30 focus-within:ring-2 focus-within:ring-blue-400">
                  <span className="px-3 text-sm text-blue-200">Password</span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Password"
                    className="bg-transparent w-full text-white placeholder-blue-200/70 outline-none px-2 py-3"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-blue-200">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-blue-400" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                  Remember me
                </label>
                <button type="button" onClick={handleForgotPassword} className="underline">Forgot?</button>
              </div>

              {error && <p className="text-red-400 text-center">{error}</p>}
              {message && <p className="text-green-400 text-center">{message}</p>}

              <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg">Sign in</button>

              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1 h-px bg-gray-700/30"></div>
                <div className="text-xs text-blue-200/80">or continue with</div>
                <div className="flex-1 h-px bg-gray-700/30"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                <button type="button" onClick={handleGoogleSignIn} className="h-11 w-full py-2 rounded-xl bg-white text-slate-800 font-medium flex items-center justify-center gap-2">
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                  Google
                </button>

                <button type="button" onClick={handleGithubSignIn} className="h-11 w-full py-2 rounded-xl bg-gray-800/50 text-white font-medium flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M12 .5C5.7.5.6 5.6.6 11.9c0 5 3.3 9.3 7.9 10.8.6.1.8-.3.8-.6v-2.2c-3.2.7-3.8-1.4-3.8-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.7-1.4-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.3 1.2.9-.3 1.9-.4 2.8-.4s1.9.1 2.8.4c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 3 .1 3.3.8.8 1.2 1.9 1.2 3.2 0 4.6-2.7 5.5-5.3 5.8.4.3.8 1 .8 2v3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.8C23.4 5.6 18.3.5 12 .5z"/></svg>
                  GitHub
                </button>

                <button type="button" onClick={handleFacebookSignIn} className="h-11 w-full py-2 rounded-xl bg-blue-700/70 text-white font-medium flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 10-11.5 9.9v-7H8.9v-3h1.6V9.1c0-1.6.9-2.6 2.4-2.6.7 0 1.4.1 1.4.1v1.6h-.8c-.8 0-1 .5-1 1v1.2h1.7l-.3 3h-1.4v7A10 10 0 0022 12z"/></svg>
                  Facebook
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;