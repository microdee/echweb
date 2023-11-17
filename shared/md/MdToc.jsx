import React, { useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import CodeExt from './Code';
import Utils from '../Utils';
import HExt from './H';
import { MdLinkHandler } from '../MdLinkHandler';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import PathContext from '../MdArticleContext';

export default function MdTocExt(props)
{
    const path = useContext(PathContext)
    return (
        <div className="mdSideToc">
            <ReactMarkdown
                className="tocContent"
                skipHtml={false}
                sourcePos={true}
                allowElement={() => true}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    code: CodeExt,
                    h1: HExt,
                    h2: HExt,
                    h3: HExt,
                    h4: HExt,
                    h5: HExt,
                    h6: HExt,
                    a: MdLinkHandler,
                }}
                transformLinkUri={(uri) => Utils.trLinkUri(uri, path.webPath)}
                transformImageUri={(uri) => Utils.trLinkUri(uri, path.filePath)}
            >
                {props.children[0]}
            </ReactMarkdown>
        </div>
    )
}

Utils.mdExt.tocmd = MdTocExt;
Utils.mdExt.mdtoc = MdTocExt;