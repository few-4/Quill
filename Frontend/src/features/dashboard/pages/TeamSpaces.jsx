import React from "react";
import { useParams } from "react-router";
import ChatPanel from "../../chat/components/ChatPanel";

const TeamSpaces = () => {
  const { workspaceId } = useParams();

  return (
    <div className="w-full h-full overflow-hidden">
      <ChatPanel workspaceId={workspaceId} />
    </div>
  );
};

export default TeamSpaces;
