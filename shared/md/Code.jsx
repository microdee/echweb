import React from 'react';
import Utils from '../Utils';
import {Gh1, Gh2} from 'echweb-shared/Gh';

const CodeBlock = React.lazy(() => import('../Codeblock'));

export default function CodeExt(props)
{
    let langMatch = /language-(\w+)/.exec(props.className || '');
    return props.inline ? (<code {...props} />)
    : (
        <React.Suspense fallback={
            <div className="importFallback">
                <Gh1 glitchtype={1}>♾️</Gh1>
            </div>
        }>
            <CodeBlock language={langMatch ? langMatch[1] : "text"} >
                {props.children}
            </CodeBlock>
        </React.Suspense>
    )
}

Utils.mdExt.code = CodeExt;