import { useState, useEffect, useCallback } from "react";
import { getCampaign } from "../api/userCampaigns";

export function useCampaign(userId, campaignId) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    //campaign ophalen
    const load = useCallback(async () => {
        if (!userId || !campaignId) return; 
        setLoading(true);
        setError(null);
    
        try {
            const data = await getCampaign(userId, campaignId);
            setData(data);
        } catch (err) {
            setError(err.message || "Failed to load campaign");
        } finally {
            setLoading(false);
        }
    }, [userId, campaignId]);

    useEffect(() => {
        load();
    },[load]);

    return { data, loading, error,reload: load, setData };
}