import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { setSSOSession, clearSSOSession } from '../lib/auth-sso';
import { doc, onSnapshot, updateDoc, arrayUnion, increment, getDoc } from 'firebase/firestore';

interface ActivityRecord {
  event: string;
  sector: "الحسابات" | "المحفظة" | "النظام";
  date: string;
  time: string;
}

interface Notification {
  id: string;
  title: string;
  msg: string;
  date: string;
  read: boolean;
}

interface AuthContextType {
  user: User | null;
  userData: any | null;
  loading: boolean;
  logout: () => Promise<void>;
  logActivity: (event: string, sector: ActivityRecord["sector"]) => Promise<void>;
  sendNotification: (title: string, msg: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Sync SSO Token
        const token = await currentUser.getIdToken();
        setSSOSession(token);

        // Listen to User Data in Real-time
        const docRef = doc(db, 'users', currentUser.uid);
        unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        }, (error) => {
          console.error("Firestore snapshot error:", error);
        });
      } else {
        clearSSOSession();
        setUserData(null);
        if (unsubscribeSnapshot) unsubscribeSnapshot();
      }
      
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const logActivity = async (event: string, sector: ActivityRecord["sector"]) => {
    if (!user) return;
    const now = new Date();
    const activity: ActivityRecord = {
      event,
      sector,
      date: now.toLocaleDateString('ar-EG'),
      time: now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };
    
    await updateDoc(doc(db, 'users', user.uid), {
      activity: arrayUnion(activity)
    });
  };

  const sendNotification = async (title: string, msg: string) => {
    if (!user) return;
    const notification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      msg,
      date: new Date().toLocaleDateString('ar-EG'),
      read: false
    };
    
    await updateDoc(doc(db, 'users', user.uid), {
      notifications: arrayUnion(notification)
    });
  };

  const logout = async () => {
    await signOut(auth);
    clearSSOSession();
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, logout, logActivity, sendNotification }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
