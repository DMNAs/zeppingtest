import { memo, useState } from "react";
import TextField from "../TextField/TextField";
import './PasswordField.css'
import { ReactComponent as ShowIcon } from '../../../resources/icons/showpassword.svg'


export default memo(function PasswordField({ label = 'Password', className = '', ...props }) {
    const
        [passwordShown, setPasswordShown] = useState(false),
        togglePassword = () => setPasswordShown(!passwordShown);

    return (
        <div className={`password-field ${className}`}>
            <TextField {...props} label={label} type={passwordShown ? "text" : "password"} autoComplete='current-password' required />
            <button className="show-password-button absolute-center" type="button" aria-label="show password" onClick={togglePassword}>
                <ShowIcon />
            </button>
        </div>)

})