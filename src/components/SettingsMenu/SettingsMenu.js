
import './SettingsMenu.css'

import SettingsLink from './SettingsLink/SettingsLink'
import { useNavigate } from 'react-router-dom'
import LinkSVG from '../LinkSVG/LinkSVG'

import { Auth } from "../../services/apiCalls";



import settings_icon from '../../resources/icons/settings.svg'
import { useMemo, useState } from 'react'
import { useLoading } from '../../services/LoaderProvider';





const localization = {
    defaultlanguages: {
        "it": "it",
        "us": "en",
        "gb": "en"
    },
    it: {
        "AccountSettings": "Impostazioni Account",
        "ChangePassword": "Cambia Password",
        "Country": "Imposta Nazionalità",
        "Language": "Lingua",
        "Legal": "Informazioni Legali",
        "Terms": "Termini di Servizio",
        "LogOut": "Disconnetti",
        "Delete": "Elimina Account",
        countries: {
            "it": "Italia",
            "fr": "Francia",
            "de": "Germania"
        },
        language: {
            "itIT": "Italiano (Italia)"
        }
    },
    en: {
        "AccountSettings": "Account Settings",
        "Email": "Email",
        "ChangePassword": "Change Password",
        "Country": "Country Settings",
        "Language": "Language",
        "Legal": "Legal",
        "Privacy": "Privacy",
        "Terms": "Terms of Service",
        "LogOut": "Log Out",
        "Delete": "Delete Account",
        "LogoutConfirm": "Are you sure you mant to log out?",
        "LogoutResolve": "Log out",
        "LogoutReject": "Cancel",
        countries: {
            "it": "Italy",
            "fr": "France",
            "de": "Germany"
        },
        language: {
            "enUK": "English (UK)",
            "enUS": "English (USA)"
        }
    }
}
//riempi i testi mancanti da default
for (const lang in localization) {
    if (lang !== "defaultlanguages" && lang !== "en") {
        localization[lang] = { ...localization.en, ...localization[lang] }
    }
}

/**@typedef {typeof localization.en} TranslatedTexts contiene i testi localizzati del menu account*/
/**
 * Trova la lingua adatta dai dati utente forniti
 * @param {string} code - codice della lingua
 * @param {string} country_code - codice della nazionalità
 * @returns {[TranslatedTexts, string, string]} - [ {testi localizzati}, codice lingua, nome linga localizzato]
 */
const parseLangCode = (code, country_code) => {
    var lang = localization[code];
    if (!lang) {
        lang = Object.values(localization).find(x => x.language?.[code]);
        if (lang) {
            return [lang, code, lang.language[code]]
        } else {
            lang = localization[localization.defaultlanguages[country_code]] ?? localization.en;
        }
    }
    return [lang, ...Object.entries(lang.language)[0]];

}


function MenuConfirm({ className = '', actions: {
    message = '',
    resolve = { name: '', action: () => { } },
    reject = { name: '', action: () => { } }
}, ...props }) {
    return (
        <div className={`menu-column ${className} flex-middle`} {...props}>
            <div className="menu-span">{message}</div>
            <div className='menu-gap-row flex-middle flex-center'>
                <button className="menu-span" onClick={resolve.action}>{resolve.name}</button>
                <button className="menu-span" onClick={reject.action}>{reject.name}</button>
            </div>
        </div>
    )
}


export default function SettingsMenu({ userData: { email, country_code, lang_code }, className = '', ...props }) {
    const [menuRequest, setMenuRequest] = useState(null);
    const waitLoading = useLoading();
    const navigate = useNavigate()
    const [texts, _, language_name] = useMemo(() => parseLangCode(lang_code, country_code), [country_code, lang_code])
    const menuActions = useMemo(() => {
        return {
            logout: {
                message: texts.LogoutConfirm,
                resolve: {
                    action: () => {
                        waitLoading(
                            Auth.logOut().finally(() => navigate('/Login'))
                        )
                    },
                    name: texts.LogoutResolve
                },
                reject: { action: () => { setMenuRequest(null) }, name: texts.LogoutReject }
            }
        }
    }, [texts, navigate, waitLoading])
    const requestLogout = useMemo(() => () => {
        setMenuRequest(menuActions.logout)
    }, [menuActions])
    return (
        <div>
            {menuRequest && <MenuConfirm actions={menuRequest} />}
            {!menuRequest && <div {...props} className={`settings-menu menu-column ${className}`}>
                <div className='menu-tag  tag-shift-l row flex-middle'>
                    <button type='button' className='settings-fast-logout' onClick={requestLogout}>
                        <LinkSVG direction='right' />
                    </button>
                    <h1>{texts.AccountSettings}</h1>
                </div>
                <div>
                    <SettingsLink to="" label={texts.Email} displayValue={email} />
                    <SettingsLink to="" label={texts.ChangePassword} displayValue='************' />{/*no need to memorize password*/}
                    <SettingsLink to="" label={texts.Country} displayValue={texts.countries[country_code]} />
                    <SettingsLink to="" label={texts.Language} displayValue={language_name} />
                </div>
                <h2 className='menu-tag tag-shift-l'>{texts.Legal}</h2>
                <div className='settings-double-link'>
                    <SettingsLink to="" label={texts.Privacy} icon={settings_icon} />
                    <SettingsLink to="" label={texts.Terms} icon={settings_icon} />
                </div>
                <div className='settings-double-link'>
                    <SettingsLink to="./logout" label={texts.LogOut} icon={settings_icon} />
                    <SettingsLink to="" label={texts.Delete} icon={settings_icon} />
                </div>
            </div>}
        </div>
    )
}