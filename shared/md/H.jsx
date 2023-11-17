import React from 'react';
import Utils from '../Utils';
import {Gh1, Gh2} from '../Gh';

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
    function H(inprops, inhprops)
    {
        if(inprops.level == 1) return (<Gh1 glitchtype="2" id={anchorText}>{inprops.children}</Gh1>);
        if(inprops.level == 2) return (<Gh2 glitchtype="2" id={anchorText}>{inprops.children}</Gh2>);
        return React.createElement(`h${inhprops.level}`, inhprops, inhprops.children);
    }

    return (
        <>
            <a id={anchorText} className="header-anchor"></a>
            {H(props, hprops)}
        </>
    )
}

Utils.mdExt.h1 = HExt;
Utils.mdExt.h2 = HExt;
Utils.mdExt.h3 = HExt;
Utils.mdExt.h4 = HExt;
Utils.mdExt.h5 = HExt;
Utils.mdExt.h6 = HExt;