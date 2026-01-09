import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useTurnOrder } from "../../hooks/useTurnOrder";
import "./turnPanel.css";

export default function TurnPanel({ userId, campaignId, mapId }) {
  const { turnData, loading } = useTurnOrder(userId, campaignId, mapId);

  if (loading || !turnData) return null;

  const { turnOrder, currentTurnIndex } = turnData;

  if (!turnOrder.length) return null;

  const current = turnOrder[currentTurnIndex];
  const next = turnOrder[(currentTurnIndex + 1) % turnOrder.length];

  const nextTurn = async () => {
    const newIndex = (currentTurnIndex + 1) % turnOrder.length;

    const ref = doc(
      db,
      "Users", userId,
      "Campaigns", campaignId,
      "Maps", mapId,
      "turnOrder", "currentTurnOrder"
    );

    await updateDoc(ref, { currentTurnIndex: newIndex });
  };

  return (
    <div className="turn-bar">
        <div className="turn-left">
            <div className="label">CURRENT</div>
            <div className="name">{current.name}</div>
        </div>

        <br />

        <button className="turn-button" onClick={nextTurn}>
        End turn
        </button>

        <br />

        <div className="turn-right">
            <div className="label">NEXT</div>
            <div className="name">{next.name}</div>
        </div>
    </div>
  );
}
