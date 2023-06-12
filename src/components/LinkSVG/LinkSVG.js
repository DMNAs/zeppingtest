import { ReactComponent as LinkIcon } from '../../resources/icons/link.svg';

/**
 * icona standard per link (chevron), ruotabile via "direction"
 */
export default function LinkSVG({ style, direction = "left", ...props }) {
    const
        dir_m = Math.abs(['left', 'bottom', 'right', 'top'].indexOf(direction)),
        rotate = dir_m > 0
            ? 90 * dir_m + 'deg'
            : undefined

    return <LinkIcon {...props} style={{ ...style, rotate }} />
}