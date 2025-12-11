import React from "react";


export default function Token({ tokenId, tokenImageUrl }) {
  return (
    <div className="token">
      {tokenImageUrl ? <img src={tokenImageUrl} alt={tokenId} /> : <span>{tokenId}</span>}
    </div>
  );
}

//alt = tokenid