import "./token.css"

export default function SidebarToken({ player, onDragStart }) {
  return (
    <div
  draggable
  onDragStart={() =>
    onDragStart({ tokenId: player.id, type: "new" }) // <-- new token from sidebar
  }
>
      {player.imageUrl ? (
        <img src={player.imageUrl} alt={player.name} />
      ) : (
        <span>{player.name}</span>
      )}
    </div>
  );
}