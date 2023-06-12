import { createContext, useContext, useMemo, useState } from "react";

const
    LoadingGetter = createContext(0),
    LoadingSetter = createContext((/**@type Promise*/p) => p);

/**
 * fornisce un contesto di loading: sincronizza le richieste di attesa provenienti dai children,
 * mantenendo un Context booleano che valuta se il sotto-albero è occupato 
 */
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

/**
 * ritorna una funzione asincrona che attende una richiesta, mantenendo lo stato di loading.
 * La funzione è memoized e non comporta il rerender del componente quando varia lo stato di loading.
 */
export function useLoading() {
    return useContext(LoadingSetter);
}

/**
 * ritorna un Context booleano che rivela lo stato di loading del sottoalbero del provider
 */
export function useLoader() {
    return useContext(LoadingGetter);
}