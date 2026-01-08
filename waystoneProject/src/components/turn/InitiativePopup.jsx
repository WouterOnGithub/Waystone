import React, { useState, useEffect } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { getPlayersByCampaign } from "../../api/players";
import { getEntitiesByType } from "../../api/npcs";
import { rollDie } from "../../services/diceRolls"
import "./initiativePopup.css";

function InitiativePopup({userId, campaignId, mapId, onConfirm, mapCells , onClose }) {
    const [initiativeData, setInitiativeData] = useState([]);
    const [loading, setLoading] = useState(true);

     useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const allPlayers = await getPlayersByCampaign(userId, campaignId);
            const allEnemies = await getEntitiesByType(userId, campaignId, "enemy");
            const allNpcs = await getEntitiesByType(userId, campaignId, "npc");

            // Alleen de characters die op de map aanwezig zijn
            const tokenIdsOnMap = new Set(Object.values(mapCells || {}).map(cell => cell.tokenId).filter(Boolean));

            const playersOnMap = allPlayers.filter(p => tokenIdsOnMap.has(p.id));
            const enemiesOnMap = allEnemies.filter(e => tokenIdsOnMap.has(e.id));
            const npcsOnMap = allNpcs.filter(n => tokenIdsOnMap.has(n.id));

            const combined = [
                ...playersOnMap.map(p => ({ ...p, type: "player", initiative: p.initiative || "", dex: p.dexterity })),
                ...enemiesOnMap.map(e => ({ ...e, type: "enemy", initiative: e.initiative || "", dex: e.dexterity })),
                ...npcsOnMap.map(n => ({ ...n, type: "npc", initiative: n.initiative || "", dex: n.dexterity })),
            ];
            setInitiativeData(combined);
            setLoading(false);
        }
        fetchData();
    }, [userId, campaignId]);

    const handleRollInitiative = (charId) => {
        setInitiativeData((prev) => 
            prev.map(c => c.id === charId ? { ...c, initiative: rollDie(20, 1) } : c)
        );
    };

    const handleConfirm = async () => {
        try {
            if (!mapId) {
            console.error("mapId is missing!");
            return;
            }

            // Bereken initiative + dex
            const finalData = initiativeData.map((char) => ({
                id: char.id,
                name: char.name,
                type: char.type,
                initiative: Number(char.initiative || 0) + (char.dex || 0),
                dex: char.dex,
            }));

            // Sorteer descending
            finalData.sort((a, b) => b.initiative - a.initiative);

            // Verwijzing naar de juiste doc in Firestore
            const turnDocRef = doc(
            db,
            "Users",
            userId,
            "Campaigns",
            campaignId,
            "Maps",
            mapId,
            "turnOrder",
            "currentTurnOrder"
            );

            console.log("Saving turn order to Firestore:", finalData);

            await setDoc(turnDocRef, {
            turnOrder: finalData,
            currentTurnIndex: 0,
            updatedAt: new Date(),
            });

            console.log("Turn order saved successfully!");
            onClose(); // sluit popup
        } catch (error) {
            console.error("Error saving turn order:", error);
        }
    };


    if(loading) return <div>loading...</div>

    return (
    <div className="initiative-popup-overlay">
        <div className="initiative-popup">
        <h2>Roll for Initiative</h2>
            {/* --- Players --- */}
            <h3>Players</h3>
            {initiativeData
            .filter((c) => c.type === "player")
            .map((char) => (
                <div key={char.id}>
                {char.name} (DEX: {char.dex || "⚠️"})
                <input
                    type="number"
                    value={char.initiative || ""}
                    onChange={(e) =>
                    setInitiativeData((prev) =>
                        prev.map((c2) =>
                        c2.id === char.id ? { ...c2, initiative: Number(e.target.value) } : c2
                        )
                    )
                    }
                />
                </div>
            ))}
            <hr />
            {/* --- Enemies --- */}
            <h3>Enemies</h3>
            {initiativeData
            .filter((c) => c.type === "enemy")
            .map((char) => (
                <div key={char.id}>
                {char.name} (DEX: {char.dex || "⚠️"})
                <input
                    type="number"
                    value={char.initiative || ""}
                    placeholder="Enter initiative or roll"
                    onChange={(e) =>
                    setInitiativeData((prev) =>
                        prev.map((c2) =>
                        c2.id === char.id ? { ...c2, initiative: e.target.value } : c2
                        )
                    )
                    }
                />
                <button onClick={() => handleRollInitiative(char.id)}>Roll</button>
                </div>
            ))}
            <hr />
            {/* --- NPCs --- */}
            <h3>NPCs</h3>
            {initiativeData
            .filter((c) => c.type === "npc")
            .map((char) => (
                <div key={char.id}>
                {char.name} (DEX: {char.dex || "⚠️"})
                <input
                    type="number"
                    value={char.initiative || ""}
                    placeholder="Enter initiative or roll"
                    onChange={(e) =>
                    setInitiativeData((prev) =>
                        prev.map((c2) =>
                        c2.id === char.id ? { ...c2, initiative: e.target.value } : c2
                        )
                    )
                    }
                />
                <button onClick={() => handleRollInitiative(char.id)}>Roll</button>
                </div>
            ))}
        <button onClick={handleConfirm}>Confirm & Save</button>
        <button onClick={onClose}>Cancel</button>
        </div>
    </div>
    );

}

export default InitiativePopup;
