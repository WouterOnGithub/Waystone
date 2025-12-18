import { useEffect, useState } from "react";
import { getPlayerById, addPlayer, updatePlayer } from "../api/players";
import { useAuth } from "../context/AuthContext.jsx";

export function usePlayer(campaignId, playerId) {
    const { user } = useAuth();
    const userId = user?.uid;

    const isEditMode = Boolean(playerId);

    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isEditMode) return;
        if (!userId || !campaignId || !playerId) return;

        const fetchPlayer = async () => {
            try {
                const data =await getPlayerById(userId, campaignId, playerId);
                setPlayer(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlayer();
    }, [isEditMode, userId, campaignId, playerId]);

    const savePlayer = async (playerData) => {
        setLoading(true);
        setError(null);

        try {
            if (isEditMode) {
                await updatePlayer(userId, campaignId, playerId, playerData);
                setPlayer({ id: playerId, ...playerData });
            } else {
                const newPlayer = await addPlayer(userId, campaignId, playerData);
                setPlayer(newPlayer);
                return newPlayer;
            }
        } catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    };

    return { player, loading, error, savePlayer, isEditMode };
}