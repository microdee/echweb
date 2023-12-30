import React, { useContext } from 'react';
import PathContext from '../MdArticleContext';
import Utils from '../Utils';
import MdLazyLoad from '../MdLazyLoad';

const MdComment = React.lazy(() => import('../MdComment'));

export default function MdCommentExt(props)
{
    const path = useContext(PathContext)
    return (
        <MdLazyLoad>
            <React.Suspense fallback={
                <div className="importFallback"><h1 className="glitch big digital">♾️</h1></div>
            }>
                <MdComment term={path.webPath} />
            </React.Suspense>
        </MdLazyLoad>
    )
}

Utils.mdExt.commentmd = MdCommentExt;
Utils.mdExt.mdcomment = MdCommentExt;