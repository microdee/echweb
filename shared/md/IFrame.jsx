import React from 'react';
import MdLazyLoad from '../MdLazyLoad';
import IframeWrapper from '../IframeWrapper';
import Utils from '../Utils';

export default function IFrameExt(props)
{
    return <MdLazyLoad>
        <IframeWrapper {...props} />
    </MdLazyLoad>
}

Utils.mdExt.iframe = IFrameExt;