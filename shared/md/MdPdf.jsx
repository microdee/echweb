import React from 'react';
import MdLazyLoad from '../MdLazyLoad';
import { MdLinkHandler, GetMdUrl } from '../MdLinkHandler';
import {Gh1, Gh2} from '../Gh';
import Utils from '../Utils';

const MdPdfRoot = React.lazy(() => import('../MdPdfRoot'));

export default function MdPdfExt(props)
{
    let {url, isFile, isDomain} = GetMdUrl(props.href);
    let passProps = {...props};
    delete passProps.href;
    if(isFile || !isDomain) return (
        <MdLazyLoad>
            <React.Suspense fallback={
                <div className="mdpdf invalid"><Gh1 glitchtype={1}>♾️</Gh1></div>
            }>
                <MdPdfRoot href={url} {...passProps} />
            </React.Suspense>
        </MdLazyLoad>
    );
    return (
        <div className="mdpdf invalid"><Gh1 glitchtype={1}>❌</Gh1></div>
    )
}

Utils.mdExt.pdfmd = MdPdfExt;
Utils.mdExt.mdpdf = MdPdfExt;