import React from 'react';
import CodeBlock from '../Codeblock';
import Utils from '../Utils';

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