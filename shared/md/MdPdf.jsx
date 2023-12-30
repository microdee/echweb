import React from 'react';
import MdLazyLoad from '../MdLazyLoad';
import { MdLinkHandler, GetMdUrl } from '../MdLinkHandler';
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
                <div className="mdpdf invalid"><h1 className="glitch big digital">♾️</h1></div>
            }>
                <MdPdfRoot href={url} {...passProps} />
            </React.Suspense>
        </MdLazyLoad>
    );
    return (
        <div className="mdpdf invalid"><h1 className="glitch big digital">❌</h1></div>
    )
}

Utils.mdExt.pdfmd = MdPdfExt;
Utils.mdExt.mdpdf = MdPdfExt;