import React from 'react';
import MdComment from '../MdComment';
import PathContext from '../MdArticleContext';
import Utils from '../Utils';

export default function MdCommentExt(props)
{
    const path = useContext(PathContext)
    return <MdComment term={path.webPath} />;
}

Utils.mdExt.commentmd = MdCommentExt;
Utils.mdExt.mdcomment = MdCommentExt;