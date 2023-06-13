import { memo } from 'react';
import './LabelCheckbox.css'
import { ReactComponent as CheckIcon } from '../../resources/icons/check.svg'

/**
 * un input tipo checkbox con icona custom e label
 */
export default memo(
    function LabelCheckbox({ children, wrapClass = '', ...props }) {
        return (
            <label className={wrapClass}>
                <div className='checkbox-wrap'>
                    <input type="checkbox" {...props} />
                    <CheckIcon className="checkbox-tick absolute-center" />
                </div>
                {children}
            </label>
        );
    })