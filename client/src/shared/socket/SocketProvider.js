import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createAuthenticatedSocket } from "@/shared/api/socket";
import { AUTH_STATUS, useAuthStore } from "@/shared/store/useAuthStore";
import { queryKeys } from "@/shared/query/queryKeys";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const useSocketEvent = (event, handler) => {
  const socket = useSocket();
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (!socket) return undefined;

    const listener = (payload) => handlerRef.current(payload);
    socket.on(event, listener);
    return () => socket.off(event, listener);
  }, [socket, event]);
};

function PresenceSync() {
  const queryClient = useQueryClient();

  useSocketEvent("presence:list", (userIds) => {
    queryClient.setQueryData(queryKeys.presence, userIds);
  });

  useSocketEvent("presence:update", ({ userId, online }) => {
    queryClient.setQueryData(queryKeys.presence, (current = []) =>
      online ? [...new Set([...current, userId])] : current.filter((id) => id !== userId)
    );
  });

  return null;
}

export function SocketProvider({ children }) {
  const status = useAuthStore((state) => state.status);
  const userId = useAuthStore((state) => state.userId);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (status !== AUTH_STATUS.authenticated || !userId) return undefined;

    let active = true;
    let connection = null;

    createAuthenticatedSocket().then((created) => {
      connection = created;
      if (active) {
        setSocket(created);
      } else {
        created.disconnect();
      }
    });

    return () => {
      active = false;
      connection?.disconnect();
      setSocket(null);
    };
  }, [status, userId]);

  return (
    <SocketContext.Provider value={socket}>
      <PresenceSync />
      {children}
    </SocketContext.Provider>
  );
}
