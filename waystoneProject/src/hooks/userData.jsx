import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../services/firebase";
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect, useState } from "react";

export default function userData() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user) return;

    const ref = doc(db, "Users", user.uid);

    const unsub = onSnapshot(ref, (snap) => {
      setData(snap.data());
    });

    return unsub;
  }, [user]);

  return data;
}