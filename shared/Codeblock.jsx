
import React from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default class CodeBlock extends React.Component {
    
    render() {
        return (
            <SyntaxHighlighter
                children={String(this.props.children)}
                language={this.props.language.toLowerCase()}
                style={vscDarkPlus}
            />
        );
    };
}