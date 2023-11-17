import React from 'react';
import MdArticle from '../MdArticle';
import Utils from '../Utils';

export default function MdNextExt(props)
{
    return <MdArticle path={props.href} />;
}

Utils.mdExt.mdnext = MdNextExt;
Utils.mdExt.nextmd = MdNextExt;
Utils.mdExt.mdinsert = MdNextExt;
Utils.mdExt.insertmd = MdNextExt;