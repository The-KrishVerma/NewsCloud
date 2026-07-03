import React, { useContext, useState, useRef } from "react";
import { AuthContext } from "../Firebase/Provider/AuthProvider";
import { storage } from "../Firebase/Firebase.config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Profile = ({ onClose }) => {
  const { user, updateUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPhotoURL(URL.createObjectURL(file)); // Local preview
    }
  };

  const handleUpdate = async (e, closeImmediately = false) => {
    if (e && e.preventDefault) e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      let finalPhotoURL = photoURL;
      
      if (selectedFile) {
        const fileRef = ref(storage, `profiles/${user.uid}/${Date.now()}_${selectedFile.name}`);
        const snapshot = await uploadBytes(fileRef, selectedFile);
        finalPhotoURL = await getDownloadURL(snapshot.ref);
      }

      await updateUser({ displayName: name, photoURL: finalPhotoURL });
      setMessage("Profile updated!");
      if (onClose) {
        if (closeImmediately) {
          onClose();
        } else {
          setTimeout(() => onClose(), 800);
        }
      }
    } catch (err) {
      console.error(err);
      if (err.message && err.message.includes("does not have permission")) {
        setError("Storage Error: Please enable Storage in Firebase Console and update rules.");
      } else {
        setError("Failed to update profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center text-gray-300">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <>
      {/* Invisible overlay to detect outside clicks and auto-save */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={(e) => {
          e.stopPropagation();
          handleUpdate(null, true);
        }}
      />
      <div className="relative z-50 bg-gray-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-blue-900/50 p-5 animate-slide-down">
      <h2 className="text-lg font-bold mb-4 text-gradient flex items-center gap-2">
        <span>👤</span> Edit Profile
      </h2>

      <div className="flex flex-col items-center mb-4 relative group cursor-pointer w-max mx-auto" onClick={() => fileInputRef.current?.click()}>
        <img 
          src={photoURL || user.photoURL || "https://via.placeholder.com/150"} 
          alt="Profile Preview" 
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-600 mb-2 shadow-lg bg-gray-700 group-hover:opacity-75 transition-opacity"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = "https://via.placeholder.com/150";
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pb-2">
          <span className="bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded shadow">Upload</span>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-xs font-medium text-gray-300 mb-1">Display Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full p-2 text-sm bg-gray-800 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="photoURL" className="block text-xs font-medium text-gray-300 mb-1">Photo URL</label>
          <input
            id="photoURL"
            type="text"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="w-full p-2 text-sm bg-gray-800 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
          <p className="text-[10px] text-gray-500 mt-1">Paste a direct link to an image.</p>
        </div>

        {error && <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">{error}</div>}
        {message && <div className="text-green-400 text-sm text-center bg-green-900/20 p-2 rounded">{message}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 text-sm bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
    </>
  );
};

export default Profile;
