import React from 'react';
import MdLazyLoad from '../MdLazyLoad';
import MdImg from '../MdImg';
import Utils from '../Utils';

export default function ImgExt(props)
{
    return <MdLazyLoad>
        <MdImg {...props} />
    </MdLazyLoad>
}

Utils.mdExt.img = ImgExt;