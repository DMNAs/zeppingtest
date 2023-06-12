import { createContext, useContext, useMemo, useState } from "react";

const
    LoadingGetter = createContext(0),
    LoadingSetter = createContext((/**@type Promise*/p) => p);

export function LoaderProvider({ children }) {
    const
        [loading, setLoading] = useState(false),
        loadingUser = useMemo(() => {
            var count = 0;
            const addToLoading = (boolVal) => {
                count = Math.max(0, count += (boolVal ? 1 : -1))
                setLoading(Boolean(count));
            };
            return async (promise) => {
                addToLoading(true);
                await promise.finally(() => addToLoading(false));
            }
        }, []);
    return (
        <LoadingGetter.Provider value={loading}>
            <LoadingSetter.Provider value={loadingUser}>
                {children}
            </LoadingSetter.Provider>
        </LoadingGetter.Provider>
    );
}

export function useLoading() {
    return useContext(LoadingSetter);
}
export function useLoader() {
    return useContext(LoadingGetter);
}