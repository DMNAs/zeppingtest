import { useEffect, useState, useRef, memo } from "react";
import './TextField.css'


export default memo(
    function TextField({ label = '', className = '', valueAdjust = (val) => val, ...props }) {
        const
            [filled, setFilled] = useState(false),
            inputRef = useRef(null);

        //nascondi la label se il text field non è vuoto
        useEffect(() => {
            /**@type HTMLInputElement */
            const input = inputRef.current
            setFilled(Boolean(input.value.trim()));

            //controlla se il campo è vuoto; permette la modifica del valore inserito con la prop valueAdjust;
            input.addEventListener('input', (event) => {
                if (event.target === input) {
                    const val = event.target.value;
                    var newVal = val.trim();
                    if (valueAdjust) {
                        newVal = valueAdjust(val.trim());
                    }
                    setFilled(Boolean(newVal));
                    if (newVal !== val) {
                        event.target.value = newVal;
                    }
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