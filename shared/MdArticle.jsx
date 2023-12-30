import React from 'react';
import ReactMarkdown from 'react-markdown';
import * as MdExtensions from './MdArticleExtensions'
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import PathContext from './MdArticleContext';
import Utils from './Utils';
import { usePath } from './hookrouter';

export default class MdArticle extends React.Component {
    constructor(props) {
        super(props);
        this.prevPath = "";
        this.state = {
            mdText: "# Loading",
            enteredVp: false,
            loading: true,
            error: false
        };
        this.intersectionObserver = null;
        this.elementCache = null;
    }

    onRef(element) {
        if(element === null) return;
        if(this.elementCache !== element) {
            if(this.elementCache !== null && this.intersectionObserver !== null)
                this.intersectionObserver.unobserve(this.elementCache);
            if(this.intersectionObserver !== null)
                this.intersectionObserver.observe(element);
            this.elementCache = element;
        }
    }

    handleIntersection(entries, observer) {
        entries.forEach(e => {
            if(e.isIntersecting && !this.state.enteredVp) {
                this.setState({
                    enteredVp: true
                }, () => this.updateArticle());
                console.log("article entered")
            }
        });
    }
        
    getAppDomNode() {
        return document.getElementById("appRoot");
    }
        
    getRealMdPath() {
        return this.props.path.replace("/c/", "/content/") + ".md";
    }

    updateArticle() {
        fetch(this.getRealMdPath())
        .then((response) => {
            if(response.status < 200 || response.status >= 300)
            throw {
                status: response.statusText
            }
            return response.text()
        })
        .then((data) => this.setState({
            mdText: data,
            error: false,
            loading: false
        }))
        .catch((reason) => this.setState({
            mdText: `I'm sorry but **${this.props.path}** ain't gonna happen.\n\n\`\`\`\n${JSON.stringify(reason, null, 4)}\n\`\`\``,
            error: true,
            loading: false,
        }));
    }
        
    componentDidUpdate() {
        if(this.prevPath !== this.props.path && this.state.enteredVp) {
            this.updateArticle();
        }
        this.prevPath = this.props.path;
    }
        
    componentDidMount() {
        this.intersectionObserver = new IntersectionObserver(this.handleIntersection.bind(this), {
            root: document.querySelector("#root"),
            rootMargin: '0px',
            threshold: 0.01
        });
        if(this.elementCache !== null)
            this.intersectionObserver.observe(this.elementCache);
        this.prevPath = this.props.path;
    }
            
    render() {
        return <div ref={this.onRef.bind(this)}>
            {
                this.state.loading ? (
                    <div
                        style={{
                            position: "relative",
                            height: "100vh"
                        }}
                    >
                        <h1 className="glitch big digital">scroll...</h1>
                    </div>
                ) : (
                    <PathContext.Provider value={{
                        webPath: this.props.path,
                        filePath: this.getRealMdPath()
                    }}>
                        <ReactMarkdown
                            className="mdArticle"
                            skipHtml={false}
                            sourcePos={true}
                            allowElement={() => true}
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            components={{ ...Utils.mdExt }}

                            transformLinkUri={((uri) => Utils.trLinkUri(uri, this.props.path)).bind(this)}
                            transformImageUri={((uri) => Utils.trLinkUri(uri, this.getRealMdPath())).bind(this)}
                        >
                            {this.state.mdText}
                        </ReactMarkdown>
                    </PathContext.Provider>
                )
            }
        </div>
    }
}
    
export function RoutedMdArticle()
{
    let location = usePath(false, true);
    let loc = location.replace(/\/$/gm, '');
    return (
        <MdArticle path={loc} />
    )
}