
import './LoginForm.css';
import PasswordField from './PasswordField/PasswordField';
import TextField from './TextField/TextField';
import CountrySelect from './CountrySelect/CountrySelect';
import { ReactComponent as ErrorIcon } from '../../resources/icons/error.svg';

import { Auth, ApiError } from '../../services/apiCalls';
import { memo, useEffect, useRef, useState } from 'react';
import { useLoading } from '../../services/LoaderProvider';
import { Link } from 'react-router-dom';
import LabelCheckbox from '../LabelCheckbox/LabelCheckbox';



export default memo(
    function LoginForm({ onLogin = () => { }, className = "", ...props }) {
        const
            formRef = useRef(),
            waitLoading = useLoading(),
            [error, setError] = useState('')

        //onSubmit del form
        const handleSubmit = async (event) => {
            //previene redirect
            event.preventDefault();
            //cancella ultimo errore
            setError('');
            //richiedi autenticazione ->  segnala login / mostra errore
            waitLoading(
                formSubmit(formRef.current, event.nativeEvent.submitter?.value)
                    .then(onLogin)
                    .catch(e => setError(e.message))
            );
        }
        useEffect(() => {
            var isMounted = true;
            //tentativo di connessione iniziale per la sessione memorizzata
            waitLoading(
                Auth.autoConnect()
                    .then(() => { if (isMounted) { onLogin?.(); setError(''); } })
                    .catch(e => {
                        //mostra errori se rilevanti al login
                        if (isMounted && (e === ApiError.NO_CONNECTION || e === ApiError.BAD_REQUEST || e === ApiError.SERVER_ERROR || e === ApiError.INVALID_RESPONSE || e === ApiError.NOT_FOUND)) {
                            setError(e.message);
                        }
                    })
            );
        }, [onLogin, waitLoading])
        return (
            <form className={`login-form ${className} flex-middle menu-column`} ref={formRef} onSubmit={handleSubmit} {...props}>
                <section>
                    <TextField name='firstname' type='text' autoComplete='given-name' label='Nome' className='menu-block' valueAdjust={adjustNameFieldValue} />
                    <TextField name='lastname' type='text' autoComplete='family-name' label='Cognome' className='menu-block' valueAdjust={adjustNameFieldValue} />
                    <TextField name='email' className='menu-block' label='Email' type='email' autoComplete='email' required />
                    <PasswordField name='password' label='Password' className='menu-block' />
                    <CountrySelect name='country' label='Nazionalità' autoComplete='country-name' tabIndex={0} className='menu-block' />
                </section>
                <section className='row-wrap flex-middle flex-center login-gap-row'>
                    <div className='flex-grow'>
                        <LabelCheckbox name="remember" wrapClass='content-width menu-tag row flex-middle text-gap'>
                            Ricordami
                        </LabelCheckbox>
                    </div>
                    <Link className='menu-span'>Password dimenticata?</Link>
                </section>
                <button className='submit-button menu-span' type="submit" value="login">Login</button>
                <section className='login-error-section '>
                    {error &&
                        <div className='login-error menu-span menu-gap-row flex-middle flex-center'>
                            <ErrorIcon />{error}
                        </div>
                    }
                </section>
                <h2 className='menu-span'>Non hai un account?</h2>
                <button className='submit-button menu-span' type="submit" value="signup">Registrati</button>
            </form>
        );
    })


const
    /**semplice validatore di campo alfabetico*/
    validateNameFieldValue = (text) => {
        //controlla se il valore ha solo valori alpha numerici
        return !(/[^a-z]/gi.test(text))
    },
    /**
     * oninput event handler per aggiustare il valore di campi alfabetici
     * rende la prima lettera uppercase e previene l'aggiunta di caratteri non alfabetici
     * l'implementazione una soluzione migliore che eviti di modificare le stringhe inserite è consigliata
     */
    adjustNameFieldValue = (/** @type {string}*/value) => {
        if (value) {
            value = value.replace(/[^a-z]/gi, '')
            value = value[0].toUpperCase() + value.slice(1);
        }
        return value;
    },
    logIn = async ({ email, password, remember }) => {
        if (email && password) {
            try {
                await Auth.logIn({ email, password, remember })
            } catch (e) {
                if (e === ApiError.UNAUTHORIZED_REQUEST)
                    throw new Error("email o password sbagliati")
                throw e
            }
        } else {
            throw new Error("email e password richiesti")
        }
    },
    signUp = async ({ firstname, lastname, email, password, country, remember }) => {
        //considero la stessa chiamata con diversi parametri
        if (firstname && lastname && email && password && country) {
            const checkedFields_valid = {
                "nome": validateNameFieldValue(firstname),
                "cognome": validateNameFieldValue(lastname)
            }
            const errorFields = Object.entries(checkedFields_valid)
                .filter(([name, value]) => !value)
                .map(([name]) => name)
            if (!errorFields.length) {
                await Auth.logIn({ firstname, lastname, email, password, country, remember });
            } else {
                throw new Error(`campi invalidi: ${errorFields}`)
            }
        } else {
            throw new Error("compila tutti i campi per registrarti")
        }
    },
    /**
     * submit del form in base ad azione di submit
    */
    formSubmit = async (form, submitType) => {
        const data = Object.fromEntries(new FormData(form));
        if (submitType === 'login') {
            await logIn(data)
        } else if (submitType === 'signup') {
            await signUp(data)
        } else throw ApiError.BAD_REQUEST
    }