import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";



export const moveToken = async (userId, campaignId, mapId, tokenId, oldX, oldY, newX, newY) => {
  const basePath = ["users", userId, "campaigns", campaignId, "maps", mapId, "cells"];

  // Clear old cell
  const oldDoc = doc(db, ...basePath, `${oldX}_${oldY}`);
  await setDoc(oldDoc, { tokenId: null }, { merge: true });

  // Set new cell
  const newDoc = doc(db, ...basePath, `${newX}_${newY}`);
  await setDoc(newDoc, { tokenId }, { merge: true });
};