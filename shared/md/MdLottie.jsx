import React from 'react';
import MdLazyLoad from '../MdLazyLoad';
import { MdLinkHandler, GetMdUrl } from '../MdLinkHandler';
import {Gh1, Gh2} from '../Gh';
import Utils from '../Utils';

const MdLottie = React.lazy(() => import('../MdLottie'));

export default function MdLottieExt(props)
{
    let {url, isFile, isDomain} = GetMdUrl(props.href);
    let passProps = {...props};
    delete passProps.href;
    if(isFile || !isDomain) return (
        <MdLazyLoad>
            <React.Suspense fallback={
                <div className="importFallback"><Gh1 glitchtype={1}>♾️</Gh1></div>
            }>
                <MdLottie href={url} {...passProps} />
            </React.Suspense>
        </MdLazyLoad>
    );
    return (
        <div className="mdLottie invalid"><Gh1 glitchtype={1}>❌</Gh1></div>
    )
}

Utils.mdExt.lottiemd = MdLottieExt;
Utils.mdExt.mdlottie = MdLottieExt;