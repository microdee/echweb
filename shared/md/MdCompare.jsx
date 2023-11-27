import React from 'react';
import MdLazyLoad from '../MdLazyLoad';
import { MdLinkHandler, GetMdUrl } from '../MdLinkHandler';
import Utils from '../Utils';
import {Gh1, Gh2} from 'echweb-shared/Gh';

const MdCompare = React.lazy(() => import('../MdCompare'));

export default function MdCompareExt(props)
{
    let ls = GetMdUrl(props.ls);
    let rs = GetMdUrl(props.rs);
    let passAttribs = {...props};
    delete passAttribs.ls;
    delete passAttribs.rs;
    return (
        <MdLazyLoad>
            <React.Suspense fallback={
                <div className="importFallback"><Gh1 glitchtype={1}>♾️</Gh1></div>
            }>
                <MdCompare ls={ls.url} rs={rs.url} {...passAttribs} />
            </React.Suspense>
        </MdLazyLoad>
    );
}

Utils.mdExt.comparemd = MdCompareExt;
Utils.mdExt.mdcompare = MdCompareExt;