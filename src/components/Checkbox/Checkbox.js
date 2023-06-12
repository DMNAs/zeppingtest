import { memo } from 'react';
import './Checkbox.css'
import { ReactComponent as CheckIcon } from '../../resources/icons/check.svg'

/**
 * un input tipo checkbox con icona custom
 */
export default memo(function Checkbox({ className = '', ...props }) {

    return (
        <div className={`checkbox-wrap ${className}`}>
            <input type="checkbox" {...props} />
            <CheckIcon className="checkbox-tick absolute-center" />
        </div>
    );
})