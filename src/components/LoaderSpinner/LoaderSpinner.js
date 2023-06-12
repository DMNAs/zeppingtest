import { memo } from 'react';
import './LoaderSpinner.css';

/**
 * 
 * @param {{loadingHook: ( ) => bool}} param0 
 */
export default memo(function LoaderSpinner({ loadingHook, className = '', ...props }) {
    const active = loadingHook() || '';
    return (
        <div className={`loader absolute-fit ${active && 'loading'} ${className}`} {...props}>
            <div className="loader-spinner absolute-center" >
                <svg className='absolute-fit' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio='xMidYMid meet'>
                    <circle cx="500" cy="500" r="450" />
                </svg>
                <svg className='absolute-fit' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio='xMidYMid meet'>
                    <circle cx="500" cy="500" r="450" />
                </svg>
            </div>
        </div>
    );
})