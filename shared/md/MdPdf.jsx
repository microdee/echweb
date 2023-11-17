import React from 'react';
import MdLazyLoad from '../MdLazyLoad';
import { MdLinkHandler, GetMdUrl } from '../MdLinkHandler';
import {Gh1, Gh2} from '../Gh';
import MdPdfRoot from '../MdPdfRoot';
import Utils from '../Utils';

export default function MdPdfExt(props)
{
    let {url, isFile, isDomain} = GetMdUrl(props.href);
    let passProps = {...props};
    delete passProps.href;
    if(isFile || !isDomain) return (
        <MdLazyLoad>
            <MdPdfRoot href={url} {...passProps} />
        </MdLazyLoad>
    );
    return (
        <div className="mdpdf invalid"><Gh1 glitchtype={1}>❌</Gh1></div>
    )
}

Utils.mdExt.pdfmd = MdPdfExt;
Utils.mdExt.mdpdf = MdPdfExt;