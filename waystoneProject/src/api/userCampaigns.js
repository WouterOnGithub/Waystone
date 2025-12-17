import { use } from "react";

async function parseJson(res, fallbackMessage) {
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || fallbackMessage);
    }
    return res.json();
}

//create new campaign (campaign subtab)
export async function createCampaign(userId, campaignData) {
    const createdAt = new Date().toISOString();
    const lastUpdatedAt = createdAt;
    const originalCreator = userId;
    const {name , genre, backstory} = campaignData;

    const res = await fetch(`/api/Campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId,
            campaignData,
            createdAt,
            lastUpdatedAt,
            originalCreator
        }),
        credentials: 'include',
    });
    return parseJson(res, 'Failed to create campaign');
}

// Get campaign data (Campaign subtab)
export async function getCampaign(userId, campaignId) {
    const res = await fetch(`/api/Campaigns?userId=${userId}&campaignId=${campaignId}`, {
        credentials: 'include'
    });
    return parseJson(res, 'Failed to get campaign');
}