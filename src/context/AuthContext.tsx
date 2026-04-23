import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut, deleteUser } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { setSSOSession, clearSSOSession } from '../lib/auth-sso';
import { doc, onSnapshot, updateDoc, arrayUnion, increment, getDoc, deleteDoc } from 'firebase/firestore';

interface ActivityRecord {
  event: string;
  sector: "الحسابات" | "المحفظة" | "النظام";
  date: string;
  time: string;
  device?: string;
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
  deleteAccount: () => Promise<void>;
  logActivity: (event: string, sector: ActivityRecord["sector"]) => Promise<void>;
  sendNotification: (title: string, msg: string) => Promise<void>;
  profileCompletion: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  let os = "نظام غير معروف";
  if (/android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Windows/i.test(ua)) os = "Windows";
  else if (/Macintosh/i.test(ua)) os = "Mac OS";
  else if (/Linux/i.test(ua)) os = "Linux";

  let browser = "متصفح غير معروف";
  if (/chrome|crios/i.test(ua)) browser = "Chrome";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua)) browser = "Safari";
  else if (/edg/i.test(ua)) browser = "Edge";
  
  return `${os} - ${browser}`;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    if (userData) {
      const fields = [
        userData.displayName,
        userData.phone,
        userData.photoURL,
        userData.region,
        userData.verificationStatus === 'verified',
        userData.usedReferralCode,
        userData.accountStatus === 'active'
      ];
      const filled = fields.filter(f => !!f).length;
      setProfileCompletion(Math.floor((filled / fields.length) * 100));
    }
  }, [userData]);

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
    const device = getDeviceInfo();
    const activity: ActivityRecord = {
      event: `${event} [${device}]`,
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

  const deleteAccount = async () => {
    if (!user) return;
    
    // According to the requirement, the data in the "Verification" sector (ISO certified) is not deleted.
    // However, we delete the main user profile and de-authenticate.
    const uid = user.uid;
    await deleteDoc(doc(db, 'users', uid));
    await deleteUser(user);
    clearSSOSession();
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, logout, deleteAccount, logActivity, sendNotification, profileCompletion }}>
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
