import React from 'react';
import Parameters from 'echweb-content/js/Parameters';
import { A } from './hookrouter';

export function IsCurrentDomain(urlin) {
    return urlin.includes('localhost') || urlin.includes(Parameters.constants.domain)
}

export function GetLocalPathFromUrl(urlin) {
    try {
        let candidate = new URL(urlin);
        return {
            url: candidate,
            localPath: candidate.pathname
        };
    } catch(e) {
        let candidate = new URL(window.location.href.replace(/#[^\/]*/gm, '') + '/../' + urlin)
        return {
            url: candidate,
            localPath: candidate.pathname
        };
    }
}

export function GetMdUrl(href) {
    let {url, localPath} = GetLocalPathFromUrl(href);
    let sanitizedUrl = url.href.replace(/#[^\/]*/gm, '');
    let sanitized = GetLocalPathFromUrl(sanitizedUrl);

    if(IsCurrentDomain(sanitized.url.href) && localPath.includes('.') && sanitized.localPath.includes('root/'))
        return {
            url: new URL(localPath.replace(/.*root\//gm, ''), window.origin).href,
            isRoot: true,
            isFile: true,
            isLocal: false,
            isDomain: true,
            isRoute: false,
            isAnchor: false
        };
    if(IsCurrentDomain(sanitized.url.href) && sanitized.localPath.includes('.'))
        return {
            url: url.href.replace('/c/', '/content/'),
            isRoot: false,
            isFile: true,
            isLocal: true,
            isDomain: true,
            isRoute: false,
            isAnchor: false
        };
    if(IsCurrentDomain(url.href) && url.href.includes('#'))
        return {
            url: url.href.replace(/.*#/gm, '#'),
            isRoot: false,
            isFile: false,
            isLocal: false,
            isDomain: true,
            isRoute: false,
            isAnchor: true
        };
    if(IsCurrentDomain(url.href))
        return {
            url: localPath,
            isRoot: false,
            isFile: false,
            isLocal: true,
            isDomain: true,
            isRoute: true,
            isAnchor: false
        }
    return {
        url: url.href,
        isRoot: false,
        isFile: false,
        isLocal: false,
        isDomain: false,
        isRoute: false,
        isAnchor: false
    };
}

export function MdLinkHandler(props) {
    let {url, isRoot, isFile, isDomain, isRoute, isAnchor} = GetMdUrl(props.href);
    
    if(isRoute) return (
        <A href={url}>{props.children}</A>
    );
    if(isAnchor) return (
        <a {...props} href={url}>{props.children}</a>
    );
    if(isRoot || isFile || !isDomain) return (
        <a {...props} href={url} target="_blank">{props.children}</a>
    );
    return ( <a {...props} target="_blank">{props.children}</a> )
}