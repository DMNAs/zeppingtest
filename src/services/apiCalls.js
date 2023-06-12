const
    /**
     * un semplice sistema di analisi degli errori da una chiamata al server non effettuata
     */
    fetchErrorHandler = (e) => {
        throw ApiError.NO_CONNECTION
    },
    /**
     * un semplice sistema di analisi degli errori da una chiamata al server
     * @param res - risposta dal server
     */
    responseErrorHandler = (res) => {
        if (res.ok) return res;
        switch (res.status) {
            case 401:
            case 403:
                throw ApiError.UNAUTHORIZED_REQUEST;
            case 404:
                throw ApiError.NOT_FOUND;
            default:
                if (res.status >= 500) {
                    throw ApiError.SERVER_ERROR;
                }
                if (res.status >= 400) {
                    throw ApiError.BAD_REQUEST;
                }
                throw ApiError.GENERIC_ERROR
        }
    },
    /**
     * esegue una chiamata POST che si aspetta una risposta in JSON.
     * ritorna un errore standardizzato in caso di fallimento.
     */
    JSONPost = (url, body) => {
        return fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: { "Content-Type": "application/json" },
            referrerPolicy: "no-referrer",
            body: JSON.stringify(body)
        })
            .catch(fetchErrorHandler)
            .then(responseErrorHandler)
            .then(res => {
                if (res.json instanceof Function)
                    return res.json()
                else throw ApiError.INVALID_RESPONSE
            })
    }

/**
 * gestisce i token di autenticazione salvati in local e session storage:
 * jwt: salvato nella sessionStorage, serve per autenticare la sessione
 * refresh token: salvato nella localStorage a lungo periodo, serve a richiedere un JWT quando questo è scaduto.
 *         considerazioni: 
 * - il JWT ha lunga scadenza quindi il refresh token è salvato esclusivamente per ricordare la sessione fuori dalla sessione browser
 * - non è noto l'indirizzo a cui richiedere un nuovo JWT da un refresh token
 * - il refresh token è supposto essere un token mantenuto nel database di autenticazione, la cui validità è quindi determinata dal server quando richiesta
 * 
 * il JWT è supposto di essere incluso in ogni richiesta autenticata al server; in caso di rifiuto dell'autenticazione, viene usato il refresh token (o viene richiesto un nuovo login) per generare un nuovo JWT valido
 */
const tokenStorage = {
    getRefreshToken: () => localStorage.getItem(authInfo.localDeviceTokenKey),
    getJWT: () => sessionStorage.getItem(authInfo.sessionJWTKey),
    getValidJWT: () => tokenStorage.validateJWT(tokenStorage.getJWT()),
    setTokens: (JWT, deviceToken) => {
        //il device token è memorizzato nel database del server quindi non serve impostarne una durata client-side
        if (deviceToken) {
            localStorage.setItem(authInfo.localDeviceTokenKey, deviceToken);
        }
        if (JWT) {
            sessionStorage.setItem(authInfo.sessionJWTKey, JWT);
        }
    },
    clearTokens: (JWT = true, deviceToken = true) => {
        if (deviceToken) {
            localStorage.removeItem(authInfo.localDeviceTokenKey);
        }
        if (JWT) {
            sessionStorage.removeItem(authInfo.sessionJWTKey);
        }
    },
    validateJWT: (token) => {
        if (!token)
            return undefined;

        var
            splits = token.split('.'),
            base64Url = splits[1],
            base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''))

        try {
            const
                payload = JSON.parse(jsonPayload),
                code = `${splits[0]}.${splits[1]}`,
                signature = splits[2];

            //validate signature

            return payload

        } catch (e) {
            return undefined
        }
    }
}


const authInfo = {
    loginUrl: 'https://sicce-test.thingscloud.it/api/mobile/login',
    localDeviceTokenKey: "lgn_rtoken",
    sessionJWTKey: "lgn_jtoken",

}

/**Errori standard, per referenza*/
export const ApiError = {
    UNAUTHORIZED_REQUEST: new Error('non autorizzato'),
    NOT_FOUND: new Error('percorso non trovato'),
    SERVER_ERROR: new Error('errore di server'),
    BAD_REQUEST: new Error('richiesta compromessa'),
    NO_CONNECTION: new Error('non connesso'),
    INVALID_RESPONSE: new Error('risposta compromessa'),
    UNAUTHENTICATED: new Error('effettua il login'),
    GENERIC_ERROR: new Error('errore')
}
export const Auth = {
    /**cerca di connettersi usano i token memorizzati nel browser storage */
    autoConnect: async () => {
        const refreshT = tokenStorage.getRefreshToken()
        tokenStorage.clearTokens();
        if (refreshT) {
            /*
                        //richiedi al server un nuovo JWT dal device_token
                        const { result, device_token, token } = await JSONPost(authInfo.refreshURL, { device_token: refreshT })
                            .catch(e => {
                                if (e === ApiError.NO_CONNECTION) {
                                    tokenStorage.setTokens(null, refreshT);
                                }
                                throw e;
                            })
                        if (result && token && device_token && tokenStorage.validateJWT(token)) {
                                tokenStorage.setTokens(token, device_token)
                                return true;
                        }
                        throw ApiError.INVALID_RESPONSE
            */
           //lancia errore per la mancanza dell'url per la POST
            throw ApiError.NOT_FOUND
        }
        //segnala fallimento
        throw ApiError.UNAUTHENTICATED;
    },
    /**cerca di autenticarsi con email e password */
    logIn: async ({ email, password, remember }) => {
        //dimentica i login passati su un nuovo tentativo
        tokenStorage.clearTokens(); //await Auth.logOut()

        const {
            result,
            device_token,
            token
        } = await JSONPost(authInfo.loginUrl, { email, password, /*"remember" to get a secure refresh key */ })

        if (result && token && (device_token || !remember) && tokenStorage.validateJWT(token)) {
            tokenStorage.setTokens(token, remember && device_token)
            return;
        }
        throw ApiError.INVALID_RESPONSE
    },
    /**rimuove i token salvati, segnala al server di invalidare le sessioni salvate in database*/
    logOut: async () => {
        const refreshT = tokenStorage.getRefreshToken()
        tokenStorage.clearTokens();
        if (refreshT) {
            //richiedi al server di dimenticare la sessione salvata
            //await JSONPost(authInfo.logoutUrl, { username, password, /*remember to get a refresh key */ })
        }
    },
    /** recupera il jwt (se necessario anche dopo un autoConnect) e ne restituisce il payload*/
    getUserData: async () => {
        var payload = tokenStorage.getValidJWT();
        if (!payload) {
            if (await Auth.autoConnect()) {
                payload = tokenStorage.getValidJWT()
                if (payload) {
                    return payload;
                } else {
                    throw ApiError.INVALID_RESPONSE
                }
            } else {
                //segnala fallimento
                throw ApiError.UNAUTHENTICATED;
            }
        }
        return payload;
    }
}