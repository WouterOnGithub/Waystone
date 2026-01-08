import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";



async function parseJson(res, fallbackMessage) {
    console.log("parseJson called, response status:", res.status); // debug

    if (!res.ok) {
        const text = await res.text();
       console.error("API response not ok:", text);
        throw new Error(text || fallbackMessage);
    } 

    const json = await res.json();
    console.log("API response json:", json); // debug: show returned data
    return json;
}

//create new campaign (campaign subtab)
export const createCampaign = async (userId, campaignData) => {
  if (!campaignData.name) {
    throw new Error("Campaign name is required");
  }

  try {
    const collectionRef = collection(db, "Users", userId, "Campaigns");

    const finalCampaignData = {
      published: false,
      isFree: true,
      ownerId: userId,
      createdAt: new Date().toISOString(),
      ...campaignData,
    };

    const docRef = await addDoc(collectionRef, finalCampaignData);
    const newDoc = await getDoc(docRef);

    return newDoc.exists()
      ? { id: docRef.id, ...newDoc.data() }
      : null;
  } catch (error) {
    console.error("Error creating campaign:", error);
    return null;
  }
};


// Get campaign data (Campaign subtab)
export const getCampaign = async (userId, campaignId) => {
    try {
        const docRef = doc(db, "Users", userId, "Campaigns", campaignId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
        console.error("Error getting campaign:", error);
        return null;
    }
};

// Get all campaigns for a user
export const getAllCampaigns = async (userId) => {
    try {
        const collectionRef = collection(db, "Users", userId, "Campaigns");
        const querySnapshot = await getDocs(collectionRef);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting all campaigns:", error);
        return [];
    }
};

//update camppaign info (name , genre, backstory)
export const updateCampaignInfo = async (userId, campaignId, campaignInfo) => {
    try {
        const docRef = doc(db, "Users", userId, "Campaigns", campaignId);
        await setDoc(docRef, {
            ...campaignInfo,
            lastUpdatedAt: new Date().toISOString()
        }, { merge: true });
        const updatedDoc = await getDoc(docRef);
        return updatedDoc.exists() ? { id: updatedDoc.id, ...updatedDoc.data() } : null;
    } catch (error) {
        console.error("Error updating campaign info:", error);
        return null;
    }
};

// LOCATION HELPERS (Map Builder)

export const createLocation = async (userId, campaignId, locationData) => {
  try {
    const collectionRef = collection(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId,
      "Locations"
    );
    const docRef = await addDoc(collectionRef, locationData);
    const newDoc = await getDoc(docRef);
    return newDoc.exists() ? { id: newDoc.id, ...newDoc.data() } : null;
  } catch (error) {
    console.error("Error creating location:", error);
    return null;
  }
};

export const updateLocation = async (
  userId,
  campaignId,
  locationId,
  locationData
) => {
  try {
    const docRef = doc(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId,
      "Locations",
      locationId
    );
    await setDoc(docRef, locationData, { merge: true });
    const updatedDoc = await getDoc(docRef);
    return updatedDoc.exists()
      ? { id: updatedDoc.id, ...updatedDoc.data() }
      : null;
  } catch (error) {
    console.error("Error updating location:", error);
    return null;
  }
};

export const getLocations = async (userId, campaignId) => {
  try {
    const collectionRef = collection(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId,
      "Locations"
    );
    const querySnapshot = await getDocs(collectionRef);
    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error("Error getting locations:", error);
    return [];
  }
};

export const deleteLocation = async (userId, campaignId, locationId) => {
  try {
    const docRef = doc(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId,
      "Locations",
      locationId
    );
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting location:", error);
    return false;
  }
};

// BUILDING / REGION HELPERS (Map Builder)

export const createBuildingRegion = async (
  userId,
  campaignId,
  buildingData
) => {
  try {
    const locationId = buildingData?.locationId || "";
    if (!locationId) {
      throw new Error("locationId is required to create a building/region");
    }

    const collectionRef = collection(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId,
      "Locations",
      locationId,
      "Regions"
    );
    const docRef = await addDoc(collectionRef, buildingData);
    await setDoc(docRef, { regionID: docRef.id }, { merge: true });
    const newDoc = await getDoc(docRef);
    return newDoc.exists() ? { id: newDoc.id, ...newDoc.data() } : null;
  } catch (error) {
    console.error("Error creating building/region:", error);
    return null;
  }
};

export const updateBuildingRegion = async (
  userId,
  campaignId,
  buildingId,
  buildingData
) => {
  try {
    const locationId = buildingData?.locationId || "";
    if (!locationId) {
      throw new Error("locationId is required to update a building/region");
    }

    const docRef = doc(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId,
      "Locations",
      locationId,
      "Regions",
      buildingId
    );
    await setDoc(
      docRef,
      { ...buildingData, regionID: buildingId },
      { merge: true }
    );
    const updatedDoc = await getDoc(docRef);
    return updatedDoc.exists()
      ? { id: updatedDoc.id, ...updatedDoc.data() }
      : null;
  } catch (error) {
    console.error("Error updating building/region:", error);
    return null;
  }
};

export const getBuildingsRegions = async (userId, campaignId) => {
  try {
    const locationsRef = collection(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId,
      "Locations"
    );
    const locationsSnap = await getDocs(locationsRef);

    const allRegions = [];
    for (const locationDoc of locationsSnap.docs) {
      const locationId = locationDoc.id;
      const regionsRef = collection(
        db,
        "Users",
        userId,
        "Campaigns",
        campaignId,
        "Locations",
        locationId,
        "Regions"
      );
      const regionsSnap = await getDocs(regionsRef);
      regionsSnap.docs.forEach((docSnap) => {
        allRegions.push({
          id: docSnap.id,
          ...docSnap.data(),
          locationId: docSnap.data()?.locationId || locationId,
        });
      });
    }

    return allRegions;
  } catch (error) {
    console.error("Error getting buildings/regions:", error);
    return [];
  }
};

export const deleteBuildingRegion = async (userId, campaignId, buildingId) => {
  try {
    const buildingDocRef = doc(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId
    );
    const locationsRef = collection(buildingDocRef, "Locations");
    const locationsSnap = await getDocs(locationsRef);

    for (const locationDoc of locationsSnap.docs) {
      const regionRef = doc(locationDoc.ref, "Regions", buildingId);
      const regionSnap = await getDoc(regionRef);
      if (regionSnap.exists()) {
        await deleteDoc(regionRef);
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error deleting building/region:", error);
    return false;
  }
};

// ITEM HELPERS

export const createItem = async (userId, campaignId, itemData) => {
  try {
    const collectionRef = collection(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId,
      "Items"
    );
    const docRef = await addDoc(collectionRef, itemData);
    const newDoc = await getDoc(docRef);
    return newDoc.exists() ? { id: docRef.id, ...newDoc.data() } : null;
  } catch (error) {
    console.error("Error creating item:", error);
    return null;
  }
};

export const updateItem = async (
  userId,
  campaignId,
  itemId,
  itemData
) => {
  try {
    const docRef = doc(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId,
      "Items",
      itemId
    );
    await setDoc(docRef, itemData, { merge: true });
    const updatedDoc = await getDoc(docRef);
    return updatedDoc.exists()
      ? { id: updatedDoc.id, ...updatedDoc.data() }
      : null;
  } catch (error) {
    console.error("Error updating item:", error);
    return null;
  }
};

export const getItems = async (userId, campaignId) => {
  try {
    const collectionRef = collection(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId,
      "Items"
    );
    const querySnapshot = await getDocs(collectionRef);
    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error("Error getting items:", error);
    return [];
  }
};

// CONTAINER HELPERS

export const createContainer = async (userId, campaignId, containerData) => {
  try {
    const collectionRef = collection(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId,
      "Containers"
    );
    const docRef = await addDoc(collectionRef, containerData);
    const newDoc = await getDoc(docRef);
    return newDoc.exists() ? { id: docRef.id, ...newDoc.data() } : null;
  } catch (error) {
    console.error("Error creating container:", error);
    return null;
  }
};

export const deleteItem = async (userId, campaignId, itemId) => {
  try {
    const docRef = doc(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId,
      "Items",
      itemId
    );
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting item:", error);
    return false;
  }
};

export const getContainers = async (userId, campaignId) => {
  try {
    const collectionRef = collection(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId,
      "Containers"
    );
    const querySnapshot = await getDocs(collectionRef);
    const containers = querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    return containers;
  } catch (error) {
    console.error("Error getting containers:", error);
    return [];
  }
};

export const updateContainer = async (
  userId,
  campaignId,
  containerId,
  containerData
) => {
  try {
    const docRef = doc(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId,
      "Containers",
      containerId
    );
    await setDoc(docRef, containerData, { merge: true });
    const updatedDoc = await getDoc(docRef);
    return updatedDoc.exists()
      ? { id: updatedDoc.id, ...updatedDoc.data() }
      : null;
  } catch (error) {
    console.error("Error updating container:", error);
    return null;
  }
};

export const deleteContainer = async (userId, campaignId, containerId) => {
  try {
    const docRef = doc(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId,
      "Containers",
      containerId
    );
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting container:", error);
    return false;
  }
};

// SESSION HELPERS

export const createSession = async (sessionCode, sessionData) => {
  try {
    const docRef = doc(db, "Sessions", sessionCode);
    await setDoc(docRef, sessionData);
    return true;
  } catch (error) {
    console.error("Error creating session:", error);
    return false;
  }
};

export const getSession = async (sessionCode) => {
  try {
    const docRef = doc(db, "Sessions", sessionCode);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
};

export const deleteSession = async (sessionCode) => {
  try {
    const docRef = doc(db, "Sessions", sessionCode);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting session:", error);
    return false;
  }
};

export const updateSessionStatus = async (sessionCode, isActive) => {
  try {
    const docRef = doc(db, "Sessions", sessionCode);
    await updateDoc(docRef, {
      isActive: isActive,
      lastUpdated: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error updating session status:", error);
    return false;
  }
};

export const subscribeToSessionStatus = (sessionCode, callback) => {
  const docRef = doc(db, "Sessions", sessionCode);
  
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      callback(data);
    } else {
      callback(null); // Session doesn't exist
    }
  }, (error) => {
    console.error("Error listening to session:", error);
    callback(null);
  });

  return unsubscribe;
};

export const updateSessionHeartbeat = async (sessionCode) => {
  try {
    const docRef = doc(db, "Sessions", sessionCode);
    await updateDoc(docRef, {
      lastHeartbeat: new Date().toISOString(),
      isActive: true
    });
    return true;
  } catch (error) {
    console.error("Error updating session heartbeat:", error);
    return false;
  }
};

export const cleanupInactiveSessions = async () => {
  try {
    const sessionsRef = collection(db, "Sessions");
    const querySnapshot = await getDocs(sessionsRef);
    
    const now = new Date();
    const cleanupPromises = [];
    
    querySnapshot.forEach((docSnap) => {
      const sessionData = docSnap.data();
      const lastHeartbeat = sessionData.lastHeartbeat ? new Date(sessionData.lastHeartbeat) : new Date(sessionData.lastUpdated);
      
      // Delete sessions that haven't had a heartbeat in 2 minutes
      const minutesSinceHeartbeat = (now - lastHeartbeat) / (1000 * 60);
      
      if (minutesSinceHeartbeat > 2) {
        console.log(`Cleaning up session ${docSnap.id}: minutes since heartbeat=${minutesSinceHeartbeat.toFixed(1)}`);
        cleanupPromises.push(deleteSession(docSnap.id));
      }
    });
    
    await Promise.all(cleanupPromises);
    console.log(`Cleaned up ${cleanupPromises.length} inactive sessions`);
    return true;
  } catch (error) {
    console.error("Error cleaning up inactive sessions:", error);
    return false;
  }
};

export const publishCampaign = async (userId, campaignId) => {
  try {
    const campaignRef = doc(db, "Users", userId, "Campaigns", campaignId);
    const snap = await getDoc(campaignRef);

    if (!snap.exists()) throw new Error("Campaign not found");

    const campaignData = snap.data();

    await updateDoc(campaignRef, {
      published: true,
      publishedAt: new Date().toISOString(),
    });

    // Add to FreeCampaigns when published (all published campaigns appear in free campaigns)
    const freeRef = doc(db, "FreeCampaigns", campaignId);
    await setDoc(freeRef, {
      ...campaignData,
      published: true,
      isFree: true,
      campaignId,
      ownerId: userId,
    });

    return true;
  } catch (error) {
    console.error("Error publishing campaign:", error);
    return false;
  }
};

export const unpublishCampaign = async (userId, campaignId) => {
  try {
    const campaignRef = doc(db, "Users", userId, "Campaigns", campaignId);

    await updateDoc(campaignRef, {
      published: false,
      unpublishedAt: new Date().toISOString(),
    });

    await deleteDoc(doc(db, "FreeCampaigns", campaignId));

    return true;
  } catch (error) {
    console.error("Error unpublishing campaign:", error);
    return false;
  }
};

export const getFreeCampaigns = async () => {
  try {
    const ref = collection(db, "FreeCampaigns");
    const snap = await getDocs(ref);
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting free campaigns:", error);
    return [];
  }
};





