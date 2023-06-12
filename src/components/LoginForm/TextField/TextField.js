import { useEffect, useState, useRef, memo } from "react";
import './TextField.css'


export default memo(function TextField({ label = '', className = '', ...props }) {
    const
        [filled, setFilled] = useState(false),
        inputRef = useRef(null);

    //nascondi la label se il text field non è vuoto
    useEffect(() => {
        /**@type HTMLInputElement */
        const input = inputRef.current
        setFilled(Boolean(input.value.trim()));
        input.addEventListener('input', (event) => {
            if (event.target === input) {
                setFilled(Boolean(event.target.value.trim()));
            }
        });
    }, []);

    return (
        <div className={`text-field ${className} ${filled ? '' : 'empty-field'}`}>
            <label>{label}</label>
            <input className="menu-input" ref={inputRef} {...props} />
        </div>
    );
})