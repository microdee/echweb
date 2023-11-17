import React from 'react';
import MdLazyLoad from '../MdLazyLoad';
import { LinkPreview } from '@dhaiwat10/react-link-preview';
import Utils from '../Utils';

export default function CardLinkExt(props)
{
    function handleResponse(response) {
        if (response.status === 204 || response.status === 205) {
          return null;
        }
        return response.json();
    }

    let transformResult = result => {
        result.metadata ??= {};
        result.metadata.title ??= "";
        result.metadata.description ??= result.metadata.title === ""
            ? props.href : "";
        result.metadata.image ??= "localhost/img-placeholder.jpg";
        result.metadata.siteName ??= "";
        result.metadata.hostname ??= new URL(props.href).hostname;
        return result;
    };

    return <MdLazyLoad>
        <LinkPreview
            className={'large' in props ? 'large' : 'small'}
            url={props.href}
            openInNewTab
            width="100%"
            fallback={<a href={props.href}>{props.href}</a>}
            backgroundColor='#000'
            primaryTextColor='#fff'
            secondaryTextColor='#bbb'
            borderColor='#fff'
            fetcher={u => {
                let hostname = window.location.hostname.replace(".", "-");
                return fetch(`https://holyolga-linkpreview-${window.location.hostname}.herokuapp.com/v2?url=${u}`)
                    .then(handleResponse)
                    .then(result => Promise.resolve(transformResult(result).metadata));
            }}
        />
    </MdLazyLoad>
}

Utils.mdExt.cardlink = CardLinkExt;
Utils.mdExt.linkcard = CardLinkExt;