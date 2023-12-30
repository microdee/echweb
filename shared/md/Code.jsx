import React from 'react';
import Utils from '../Utils';
import CodeBlock from '../Codeblock';

// bullshit happens when you do this. fucking web development
// const CodeBlock = React.lazy(() => import('../Codeblock'));

export default function CodeExt(props)
{
    let langMatch = /language-(\w+)/.exec(props.className || '');
    return props.inline ? (<code {...props} />)
    : (
        <CodeBlock language={langMatch ? langMatch[1] : "text"} >
            {props.children}
        </CodeBlock>
    )
}

Utils.mdExt.code = CodeExt;