import React from 'react';
import MdLazyLoad from '../MdLazyLoad';
import { MdLinkHandler, GetMdUrl } from '../MdLinkHandler';
import {Gh1, Gh2} from '../Gh';
import MdLottie from '../MdLottie';
import Utils from '../Utils';

export default function MdLottieExt(props)
{
    let {url, isFile, isDomain} = GetMdUrl(props.href);
    let passProps = {...props};
    delete passProps.href;
    if(isFile || !isDomain) return (
        <MdLazyLoad>
            <MdLottie href={url} {...passProps} />
        </MdLazyLoad>
    );
    return (
        <div className="mdLottie invalid"><Gh1 glitchtype={1}>❌</Gh1></div>
    )
}

Utils.mdExt.lottiemd = MdLottieExt;
Utils.mdExt.mdlottie = MdLottieExt;