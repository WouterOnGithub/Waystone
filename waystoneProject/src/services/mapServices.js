import { doc, runTransaction } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const moveToken = async (
  userId,
  campaignId,
  mapId,
  tokenId,
  oldX,
  oldY,
  newX,
  newY
) => {
  const cellsPath = ["Users", userId, "Campaigns", campaignId, "Maps", mapId, "Cells"];

  const oldRef = doc(db, ...cellsPath, `${oldX}_${oldY}`);
  const newRef = doc(db, ...cellsPath, `${newX}_${newY}`);

  

  await runTransaction(db, async (tx) => {

    const target = await tx.get(newRef);
if (target.exists()) throw new Error("Cell occupied");

    tx.delete(oldRef);
   
    tx.set(newRef, {
      tokenId,
      x: newX,
      y: newY,
    });
  });
};