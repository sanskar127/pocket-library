import { useRef } from "react";
import { useLocation } from "react-router";

const useLastNonWatchPath = () => {
    const location = useLocation();
    const lastNonWatchPathRef = useRef(location.pathname);

    // More precise: matches only paths like "/watch", "/watch:", or "/watch/"
    const isWatchPage = /^\/watch($|[/:])/.test(location.pathname);

    if (!isWatchPage && lastNonWatchPathRef.current !== location.pathname) {
        lastNonWatchPathRef.current = location.pathname;
    }

    return lastNonWatchPathRef.current;
};

export default useLastNonWatchPath;
