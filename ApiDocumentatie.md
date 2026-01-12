API DOCUMENTATION

Base structure (Firestore):

Users/{userId}/Campaigns/{campaignId}/

Maps/{mapId} Maps/{mapId}/Cells/{cellId}
Maps/{mapId}/turnOrder/currentTurnOrder

Players/{playerId} Players/{playerId}/Inventory/default

Entities/{entityId} Containers/{containerId} Items/{itemId}

Hooks & Functional Description
useUserId() Returns current authenticated userId.

useMap(userId, campaignId, mapId) Fetches and listens to a map document.

useMapCells(userId, campaignId, mapId) Realtime listener for all map
cells.

useTurnOrder(userId, campaignId, mapId) Fetches and listens to current
turn order.

useCampaign(userId, campaignId) Loads campaign data via API.

useAccount() Fetches and updates account profile.

usePlayer(campaignId, playerId) Creates or edits a player using API.

usePlayer(userId, campaignId, playerId) Realtime listener for a player.

useUpdateHp(userId, campaignId, tokenType, tokenId) Updates HpCurrent of
player or entity.

useEntitiesByType(userId, campaignId, type, mapCells) Returns available
entities not on the map.

useAvailablePlayers(userId, campaignId, mapCells) Returns available
players not on the map.

useContainers(userId, campaignId, mapCells) Returns available containers
not on the map.

useContainer(userId, campaignId, containerId) Returns a container.

useInventory(ownerId, campaignId, userId, tokenType) Fetches inventory
for player or entity.

usePlayerInventory(userId, campaignId, playerId) Full inventory CRUD
system.

useItems(userId, campaignId) Loads item catalogue.

Inventory Slot Format
SlotX: ItemID: string Amount: number lastUpdated: timestamp

Security Assumptions
All operations require authenticated
user. User owns all subcollections.

Realtime Behaviour:
Most hooks use Firestore onSnapshot
listeners. Data updates propagate instantly.