import React from 'react';
import Utils from '../Utils';

export default function HExt(props)
{
    let headerText = Utils.getMainTextOfComponent(props.children);
    let anchorText = headerText
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/[^a-z0-9]+$/gi, '')
        .toLowerCase();
    let hprops = {
        ...props
    }

    if (hprops.className || false) {
        hprops.className += " glitch analog subtle";
    }
    else {
        hprops.className = "glitch analog subtle";
    }

    if (hprops.level <= 1) {
        hprops.className = hprops.className.replace("analog", "digital");
    }

    return (
        <>
            <a id={anchorText} className="header-anchor"></a>
            {React.createElement(`h${hprops.level}`, hprops, hprops.children)}
        </>
    )
}

Utils.mdExt.h1 = HExt;
Utils.mdExt.h2 = HExt;
Utils.mdExt.h3 = HExt;
Utils.mdExt.h4 = HExt;
Utils.mdExt.h5 = HExt;
Utils.mdExt.h6 = HExt;