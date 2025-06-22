import React, { useContext } from 'react';
import Utils from '../Utils';
import PathContext from '../MdArticleContext';

export default function MdTocExt(props)
{
    const path = useContext(PathContext)
    return (
        <div className="mdSideToc">
            <div className="tocContent">
                {props.children}
            </div>
        </div>
    )
}

Utils.mdExt.tocmd = MdTocExt;
Utils.mdExt.mdtoc = MdTocExt;