import React, { useContext } from 'react';
import Utils from '../Utils';
import MdFullParallaxWrap from '../MdFullParallaxWrap';

export default function MdFullExt(props)
{
    let directProps = {...props};
    delete directProps.children;
    return (
        <MdFullParallaxWrap {...directProps}>
            <div>
                {props.children}
            </div>
        </MdFullParallaxWrap>
    );
}

Utils.mdExt.fullmd = MdFullExt;
Utils.mdExt.mdfull = MdFullExt;