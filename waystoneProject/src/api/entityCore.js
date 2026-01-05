import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

export const createBaseCharacter = async (path, data) => {
  const collectionRef = collection(db, ...path);

  const docRef = await addDoc(collectionRef, {
    ...data,
    createdAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  });

  const inventoryRef = doc(db, ...path, docRef.id, "Inventory", "default");

  const maxSlots = 20;
  const initialSlots = {};

  for (let i = 1; i <= maxSlots; i++) {
    initialSlots[`Slot${i}`] = {
      Amount: 0,
      ItemID: "",
      lastUpdated: serverTimestamp()
    };
  }

  await setDoc(inventoryRef, {
    capacity: maxSlots,
    ...initialSlots
  });

  return { id: docRef.id, ...data };
};
