import { memo } from 'react'
import LinkSVG from '../../LinkSVG/LinkSVG'
import './SettingsLink.css'

import { Link } from 'react-router-dom'


export default memo(function SettingsLink({ to, label = '', displayValue = '', className = '', icon = '', ...props }) {
    return (
        <Link className={`${className} settings-link menu-block row flex-middle text-gap outline-hover`} to={to} {...props}>
            {icon && <img src={icon} alt="" className='settings-link-icon' />}
            <div className='settings-link-content flex-grow'>
                <div className='settings-link-label'>{label}</div>
                {displayValue && <div className='settings-link-value'>{displayValue}</div>}
            </div>
            <LinkSVG className="settings-link-icon" />
        </Link>
    )
})