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
  query,
  where,
} from "firebase/firestore";

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
        await updateDoc(docRef, {
            ...campaignInfo,
            lastUpdatedAt: new Date().toISOString()
        });
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
    // First, get the location data to retrieve the imageUrl
    const docRef = doc(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId,
      "Locations",
      locationId
    );
    
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.error("Location not found:", locationId);
      return false;
    }
    
    const locationData = docSnap.data();
    const imageUrl = locationData?.imageUrl;
    
    // Delete the image file from the server if it exists
    if (imageUrl) {
      try {
        const res = await fetch("/api/delete-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl }),
        });
        
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.warn("Failed to delete location image:", err.error || "Unknown error");
        } else {
          console.log("Successfully deleted location image:", imageUrl);
        }
      } catch (imageError) {
        console.warn("Error deleting location image:", imageError);
        // Continue with location deletion even if image deletion fails
      }
    }
    
    // Delete the Firestore document
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting location:", error);
    return false;
  }
};

// EVENT HELPERS

export const createEvent = async (userId, campaignId, eventData) => {
  try {
    // Generate a unique mapId for this event
    const eventMapId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const docRef = doc(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId,
      "Maps",
      eventMapId
    );
    
    // Add the eventMapId to the event data
    const dataWithMapId = {
      ...eventData,
      mapId: eventMapId,
      isEvent: true // Flag to identify this as an event Map
    };
    
    await setDoc(docRef, dataWithMapId);
    const newDoc = await getDoc(docRef);
    return newDoc.exists() ? { id: newDoc.id, mapId: eventMapId, ...newDoc.data() } : null;
  } catch (error) {
    console.error("Error creating event:", error);
    return null;
  }
};

export const updateEvent = async (
  userId,
  campaignId,
  eventMapId,
  eventData
) => {
  try {
    const docRef = doc(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId,
      "Maps",
      eventMapId
    );
    
    const dataWithMapId = {
      ...eventData,
      mapId: eventMapId,
      isEvent: true
    };
    
    await setDoc(docRef, dataWithMapId, { merge: true });
    const updatedDoc = await getDoc(docRef);
    return updatedDoc.exists()
      ? { id: updatedDoc.id, mapId: eventMapId, ...updatedDoc.data() }
      : null;
  } catch (error) {
    console.error("Error updating event:", error);
    return null;
  }
};

export const getEvents = async (userId, campaignId) => {
  try {
    const mapsCollectionRef = collection(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId,
      "Maps"
    );
    
    // Query for all maps that are events
    const q = query(mapsCollectionRef, where("isEvent", "==", true));
    const querySnapshot = await getDocs(q);
    
    const events = [];
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, mapId: doc.id, ...doc.data() });
    });
    
    return events;
  } catch (error) {
    console.error("Error getting events:", error);
    return [];
  }
};

export const deleteEvent = async (userId, campaignId, eventMapId) => {
  try {
    // First, get the event data to retrieve the imageUrl
    const docRef = doc(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId,
      "Maps",
      eventMapId
    );
    
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      console.error("Event not found:", eventMapId);
      return false;
    }
    
    const eventData = docSnap.data();
    const imageUrl = eventData?.imageUrl;
    
    // Delete the image file from the server if it exists
    if (imageUrl) {
      try {
        const res = await fetch("/api/delete-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl }),
        });
        
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.warn("Failed to delete event image:", err.error || "Unknown error");
        } else {
          console.log("Successfully deleted event image:", imageUrl);
        }
      } catch (imageError) {
        console.warn("Error deleting event image:", imageError);
        // Continue with event deletion even if image deletion fails
      }
    }
    
    // Delete the Firestore document
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
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
        const regionData = regionSnap.data();
        const imageUrl = regionData?.imageUrl;
        
        // Delete the image file from the server if it exists
        if (imageUrl) {
          try {
            const res = await fetch("/api/delete-image", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ imageUrl }),
            });
            
            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              console.warn("Failed to delete building/region image:", err.error || "Unknown error");
            } else {
              console.log("Successfully deleted building/region image:", imageUrl);
            }
          } catch (imageError) {
            console.warn("Error deleting building/region image:", imageError);
            // Continue with building/region deletion even if image deletion fails
          }
        }
        
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

    const docRef = doc(collectionRef);
    await setDoc(docRef, containerData); 
    const newDoc = await getDoc(docRef); 
    return newDoc.exists() 
      ? { id: newDoc.id, ...newDoc.data() } : null;
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

export const updateSessionBattleMap = async (sessionCode, battleMapData) => {
  try {
    console.log("updateSessionBattleMap: Updating session", sessionCode, "with data:", battleMapData);
    const docRef = doc(db, "Sessions", sessionCode);
    await setDoc(docRef, battleMapData, { merge: true });
    console.log("updateSessionBattleMap: Successfully updated session");
    return true;
  } catch (error) {
    console.error("Error updating session battle map:", error);
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

    // Copy all campaign data to FreeCampaigns
    await copyCampaignToFreeCampaigns(userId, campaignId, campaignData);

    return true;
  } catch (error) {
    console.error("Error publishing campaign:", error);
    return false;
  }
};

// Comprehensive function to copy all campaign data to FreeCampaigns
const copyCampaignToFreeCampaigns = async (userId, campaignId, campaignData) => {
  try {
    // 1. Copy main campaign document
    const freeRef = doc(db, "FreeCampaigns", campaignId);
    await setDoc(freeRef, {
      ...campaignData,
      published: true,
      isFree: true,
      campaignId,
      ownerId: userId, // Set to current user's ID
      originalCampaignId: campaignId, // Reference to original
    });

    // 2. Copy all subcollections
    await copySubCollection(userId, campaignId, "Locations", campaignId);
    await copySubCollection(userId, campaignId, "Maps", campaignId);
    await copySubCollection(userId, campaignId, "Entities", campaignId);
    await copySubCollection(userId, campaignId, "Items", campaignId);
    await copySubCollection(userId, campaignId, "Containers", campaignId);
    // Note: Players are NOT copied as per requirements

    console.log(`Successfully copied campaign ${campaignId} to FreeCampaigns`);
  } catch (error) {
    console.error("Error copying campaign to FreeCampaigns:", error);
    throw error;
  }
};

// Generic function to copy any subcollection
const copySubCollection = async (userId, campaignId, subcollectionName, freeCampaignId) => {
  try {
    const sourceRef = collection(db, "Users", userId, "Campaigns", campaignId, subcollectionName);
    const targetRef = collection(db, "FreeCampaigns", freeCampaignId, subcollectionName);
    
    const snapshot = await getDocs(sourceRef);
    const copyPromises = snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();
      const targetDoc = doc(targetRef, docSnap.id);
      
      // Special handling for Maps subcollection to preserve mapId
      if (subcollectionName === "Maps" && data.mapId) {
        await setDoc(targetDoc, {
          ...data,
          mapId: data.mapId // Preserve the mapId field
        });
      } else {
        await setDoc(targetDoc, data);
      }
    });
    
    await Promise.all(copyPromises);
    console.log(`Copied ${snapshot.docs.length} documents from ${subcollectionName}`);
  } catch (error) {
    console.error(`Error copying subcollection ${subcollectionName}:`, error);
    throw error;
  }
};

// Set up real-time sync between original and free campaign
export const setupCampaignSync = (userId, campaignId) => {
  const sourceRefs = [
    collection(db, "Users", userId, "Campaigns", campaignId, "Locations"),
    collection(db, "Users", userId, "Campaigns", campaignId, "Maps"),
    collection(db, "Users", userId, "Campaigns", campaignId, "Entities"),
    collection(db, "Users", userId, "Campaigns", campaignId, "Items"),
    collection(db, "Users", userId, "Campaigns", campaignId, "Containers"),
  ];

  const targetRefs = [
    collection(db, "FreeCampaigns", campaignId, "Locations"),
    collection(db, "FreeCampaigns", campaignId, "Maps"),
    collection(db, "FreeCampaigns", campaignId, "Entities"),
    collection(db, "FreeCampaigns", campaignId, "Items"),
    collection(db, "FreeCampaigns", campaignId, "Containers"),
  ];

  const unsubscribers = [];

  sourceRefs.forEach((sourceRef, index) => {
    const targetRef = targetRefs[index];
    
    const unsubscribe = onSnapshot(sourceRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "modified" || change.type === "added") {
          const docData = change.doc.data();
          const targetDoc = doc(targetRef, change.doc.id);
          setDoc(targetDoc, docData);
        } else if (change.type === "removed") {
          const targetDoc = doc(targetRef, change.doc.id);
          deleteDoc(targetDoc);
        }
      });
    });

    unsubscribers.push(unsubscribe);
  });

  // Return function to unsubscribe all listeners
  return () => {
    unsubscribers.forEach(unsubscribe => unsubscribe());
  };
};

// Copy free campaign to user's campaigns
export const copyFreeCampaignToUser = async (userId, freeCampaignId) => {
  try {
    // Get the free campaign data
    const freeRef = doc(db, "FreeCampaigns", freeCampaignId);
    const freeSnap = await getDoc(freeRef);
    
    if (!freeSnap.exists()) {
      throw new Error("Free campaign not found");
    }
    
    const freeData = freeSnap.data();
    
    // Create new campaign in user's collection
    const userCampaignsRef = collection(db, "Users", userId, "Campaigns");
    const newCampaignRef = await addDoc(userCampaignsRef, {
      name: freeData.name,
      description: freeData.description || "",
      genre: freeData.genre || "",
      backstory: freeData.backstory || "",
      mainMapUrl: freeData.mainMapUrl || null, // Ensure mainMapUrl is copied
      published: false, // User's copy starts as unpublished
      isFree: false,
      ownerId: userId,
      createdAt: new Date().toISOString(),
      copiedFromFreeCampaign: freeCampaignId, // Reference to source
    });
    
    const newCampaignId = newCampaignRef.id;
    
    // Copy all subcollections from free campaign to user's campaign
    await copySubCollectionToUserCampaign(freeCampaignId, "Locations", userId, newCampaignId);
    await copySubCollectionToUserCampaign(freeCampaignId, "Maps", userId, newCampaignId);
    await copySubCollectionToUserCampaign(freeCampaignId, "Entities", userId, newCampaignId);
    await copySubCollectionToUserCampaign(freeCampaignId, "Items", userId, newCampaignId);
    await copySubCollectionToUserCampaign(freeCampaignId, "Containers", userId, newCampaignId);
    
    console.log(`Successfully copied free campaign ${freeCampaignId} to user ${userId} as ${newCampaignId}`);
    return { id: newCampaignId, ...freeData };
  } catch (error) {
    console.error("Error copying free campaign to user:", error);
    throw error;
  }
};

// Copy subcollection from free campaign to user's campaign
const copySubCollectionToUserCampaign = async (freeCampaignId, subcollectionName, userId, newCampaignId) => {
  try {
    const sourceRef = collection(db, "FreeCampaigns", freeCampaignId, subcollectionName);
    const targetRef = collection(db, "Users", userId, "Campaigns", newCampaignId, subcollectionName);
    
    const snapshot = await getDocs(sourceRef);
    const copyPromises = snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();
      const targetDoc = doc(targetRef, docSnap.id);
      
      // Special handling for Maps subcollection to preserve mapId
      if (subcollectionName === "Maps" && data.mapId) {
        await setDoc(targetDoc, {
          ...data,
          mapId: data.mapId // Preserve the mapId field
        });
      } else {
        await setDoc(targetDoc, data);
      }
    });
    
    await Promise.all(copyPromises);
    console.log(`Copied ${snapshot.docs.length} documents from ${subcollectionName} to user campaign`);
  } catch (error) {
    console.error(`Error copying subcollection ${subcollectionName} to user campaign:`, error);
    throw error;
  }
};

export const deleteCampaign = async (userId, campaignId) => {
  try {
    // Delete all subcollections first
    const subcollections = ["Locations", "Maps", "Entities", "Items", "Containers", "Players"];
    
    for (const subcollectionName of subcollections) {
      const subcollectionRef = collection(db, "Users", userId, "Campaigns", campaignId, subcollectionName);
      const snapshot = await getDocs(subcollectionRef);
      
      const deletePromises = snapshot.docs.map(async (docSnap) => {
        const docRef = doc(db, "Users", userId, "Campaigns", campaignId, subcollectionName, docSnap.id);
        await deleteDoc(docRef);
      });
      
      await Promise.all(deletePromises);
      console.log(`Deleted ${snapshot.docs.length} documents from ${subcollectionName}`);
    }
    
    // Delete the main campaign document
    const campaignRef = doc(db, "Users", userId, "Campaigns", campaignId);
    await deleteDoc(campaignRef);
    
    console.log(`Successfully deleted campaign ${campaignId} and all its data`);
    return true;
  } catch (error) {
    console.error("Error deleting campaign:", error);
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





