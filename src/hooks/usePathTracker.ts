import { useRef } from "react";
import { useLocation } from "react-router";

const useLastNonWatchPath = () => {
    const location = useLocation();
    const lastNonWatchPathRef = useRef(location.pathname);

    // Matches paths like "/watch", "/watch:", "/watch/", "/view", "/view:", or "/view/"
    const isWatchOrViewPage = /^\/(watch|view)($|[/:])/.test(location.pathname);

    if (!isWatchOrViewPage && lastNonWatchPathRef.current !== location.pathname) {
        lastNonWatchPathRef.current = location.pathname;
    }

    return lastNonWatchPathRef.current;
};

export default useLastNonWatchPath;
