import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import firebaseConfig from '../config/firebase';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Mock Firestore functions for now since Firestore isn't configured
const mockFirestore = {
  collection: () => ({}),
  doc: () => ({}),
  setDoc: async () => {},
  updateDoc: async () => {},
  getDoc: async () => ({ exists: () => false }),
  serverTimestamp: () => new Date()
};

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext();

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '753328004035-kl4a6kr531fc920umdnn2qakp1mgjess.apps.googleusercontent.com',
    iosClientId: '753328004035-0dc4aufq4vov37adht39q3grleag0h4r.apps.googleusercontent.com',
    webClientId: '753328004035-kl4a6kr531fc920umdnn2qakp1mgjess.apps.googleusercontent.com',
  });

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, onAuthStateChanged);
    return subscriber;
  }, []);

  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    try {
      const result = await promptAsync();
      
      if (result.type === 'success') {
        const { id_token } = result.params;
        
        // Create a Google credential with the token
        const googleCredential = GoogleAuthProvider.credential(id_token);
        
        // Sign-in the user with the credential
        const userCredential = await signInWithCredential(auth, googleCredential);
        
        // Save user profile
        await saveUserProfile(userCredential.user);
        
        return userCredential.user;
      } else {
        throw new Error('Google Sign-In was cancelled');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw new Error('Google Sign-In failed: ' + error.message);
    }
  };

  const signUpWithEmail = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      await userCredential.user.updateProfile({
        displayName: displayName,
      });
      
      // Save user profile to Firestore
      await saveUserProfile({
        ...userCredential.user,
        displayName: displayName,
      });
      return userCredential.user;
    } catch (error) {
      console.error('Sign Up Error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;

    } catch (error) {
      console.error('Sign In Error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Sign Out Error:', error);
      throw error;
    }
  };

  const saveUserProfile = async (user) => {
    try {
      // Store user data locally for now since Firestore isn't configured
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Anonymous',
        photoURL: user.photoURL || null,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        totalScore: 0,
        bestScore: 0,
        averageScore: 0,
        levelsCompleted: 0,
        gamesPlayed: 0,
      };
      
      console.log('User profile saved locally:', userData);
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  };

  const updateUserStats = async (stats) => {
    if (!user) return;
    
    try {
      console.log('User stats updated locally:', stats);
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  };

  const getUserProfile = async (uid) => {
    try {
      // Return mock user data for now
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  };

  if (initializing) {
    return null;
  }

  const value = {
    user,
    loading,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    signOut,
    updateUserStats,
    getUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};