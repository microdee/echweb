import React, { useContext } from 'react';
import Utils from '../Utils';
import MdFullParallaxWrap from '../MdFullParallaxWrap';

export default function MdCaptionedExt({text, children, nomargin})
{
    return (
        <div className='mdCaptionWrap'>
            {children}
            {nomargin ? <></> : <div className="imgCaptionPre"></div>}
            <span className="imgCaption">{text}</span>
            {nomargin ? <></> : <div className="imgCaptionPost"></div>}
        </div>
    );
}

Utils.mdExt.captionmd = MdCaptionedExt;
Utils.mdExt.mdcaption = MdCaptionedExt;