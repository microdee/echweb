import React from 'react';
import MdLazyLoad from '../MdLazyLoad';
import { LinkPreview } from '@dhaiwat10/react-link-preview';
import Utils from '../Utils';

export default function CardLinkExt(props)
{
    let sizeClass = 'size' in props ? props.size : 'large';
    let hasChildren = 'children' in props;
    if (hasChildren && Array.isArray(props.children))
    {
        hasChildren = props.children.length > 0;
    }

    return <div className={`cardlink ${sizeClass}`}>
        {
            hasChildren
                ? props.children
                : <>
                    <p>Run FetchLinkMeta</p>
                    <p>{props.href}</p>
                </>
        }
    </div>
}

Utils.mdExt.cardlink = CardLinkExt;
Utils.mdExt.linkcard = CardLinkExt;