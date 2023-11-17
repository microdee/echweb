import React from "react";
import ReactDOM from "react-dom";
import HTMLFlipBook from "react-pageflip";
import {Gh1, Gh2 } from './Gh';
import { pdfjs, Document, Outline, Page as PdfPage } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import '../css/pdf-flip.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.js`;

// TODO: display loading progress
// TODO: display error
// TODO: display outline
// TODO: responsiveness (portrait mode on mobile / small window)
//     TODD: decide single page view

function Page(props)
{
    return <PdfPage {...props}
        error={<Gh1 glitchtype="1">❌</Gh1>}
        noData={<Gh1 glitchtype="1">⚠️</Gh1>}
        loading={<Gh1 glitchtype="1">♾️</Gh1>}
        onRenderError={e => console.log(e)}
        onLoadError={e => console.log(e)}
        onRenderTextLayerError={e => console.log(e)}
        onGetAnnotationsError={e => console.log(e)}
        onGetTextError={e => console.log(e)}
    />;
}

export default class MdPdf extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currPage: 0,
            pageCount: 1,
            inputPageCount: 1,
            loaded: false,
            displayed: false,
            width: 100,
            height: 100,
        };
        this.mainDiv = React.createRef();
        this.flipBook = React.createRef();
        this.scanPageId = 0;
        this.pdfMaxHeight = 100;
        this.pdfMaxWidth = 100;
    }

    handleResize() {
        this.setState(this.getWidthHeight());
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize.bind(this));
        this.handleResize();
    }
    componentWillUnmount() {
        this.props.setPersistent(this.state);
    }

    hasMergedPairs() {
        return this.props.mergedpairs ?? false;
    }

    hasCover() {
        return this.props.cover ?? false;
    }

    isFull() {
        return "full" in this.props;
    }

    determineSize(pdf, page, callback) {
        let viewport = page.getViewport();
        let w = viewport.viewBox[2];
        let h = viewport.viewBox[3];
        this.pdfMaxHeight = Math.max(this.pdfMaxHeight, h);
        let isHalfWidth = this.hasMergedPairs() && !(this.hasCover() && this.scanPageId == 0);
        this.pdfMaxWidth = Math.max(this.pdfMaxWidth, w / (1 + isHalfWidth));
        this.scanPageId++;
        if (this.scanPageId < pdf.numPages) {
            pdf.getPage(this.scanPageId + 1).then((nextPage => this.determineSize(pdf, nextPage, callback)).bind(this));
        }
        else {
            callback();
        }
    }

    getWidthHeight() {
        let mainWidth = this.mainDiv.current.parentNode.clientWidth;
        let mainHeight = this.mainDiv.current.parentNode.clientHeight;
        let hpw = this.pdfMaxHeight / (this.pdfMaxWidth * 2);
        let wph = (this.pdfMaxWidth) / this.pdfMaxHeight;
        if (this.isFull() && window.innerWidth > window.innerHeight)
        {
            return {
                width: mainHeight / wph,
                height: mainHeight
            }
        }
        if (this.isFull())
        {
            mainWidth = window.innerWidth;
        }
        return {
            width: mainWidth,
            height: hpw * mainWidth
        }
    }

    isPagePrepared(i) {
        const range = 4;
        let id = this.state.currPage;
        return i >= (id - range) && i < (id + range + 2);
    }

    onDocumentLoaded(pdf) {
        this.scanPageId = 0;
        let callback = () => {
            // TODO: single page mode?
            let count = this.hasMergedPairs()
                ? pdf.numPages * 2 - (this.hasCover() ? 1 : 0)
                : pdf.numPages;
            this.setState(
                {
                    loaded: true,
                    inputPageCount: pdf.numPages,
                    pageCount: count,
                    ... this.getWidthHeight()
                }
            )
        };
        pdf.getPage(1).then((nextPage => this.determineSize(pdf, nextPage, callback.bind(this))).bind(this));
    }

    nextPage() {
        this.setState(
            { currPage: Math.min(this.state.currPage + 1, this.state.pageCount - 1) },
            () => this.flipBook.current?.pageFlip()?.flipNext()
        );
    }
    prevPage() {
        this.setState(
            { currPage: Math.max(this.state.currPage - 1, 0) },
            () => this.flipBook.current?.pageFlip()?.flipPrev()
        );
    }

    onItemClick({ pageNumber: itemPageNumber }) {
        this.setState(
            { currPage: itemPageNumber },
            () => this.flipBook.current?.pageFlip()?.flip({ pageNum: this.state.currPage })
        );
    }

    onFlipBookChangeState() {
        let id = this.flipBook.current?.pageFlip()?.getCurrentPageIndex();
        this.setState({currPage: id});
    }

    onFlipBookInit() {
        let pf = this.flipBook.current?.pageFlip();
        if (this.props.persistent !== null) {
            pf?.turnToPage(this.props.persistent.currPage);
        }
    }

    render() {
        let passProps = {...this.props};
        delete passProps.href;
        delete passProps.mergedPairs;
        delete passProps.hascover;

        if('filter' in passProps) {
            passProps.style = {filter: passProps.filter};
        }
        
        return (
            <div ref={this.mainDiv} className="mdPdf" {...passProps}>
                <Document
                    file={this.props.href}
                    onItemClick={this.onItemClick}
                    options={{
                        cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
                        cMapPacked: true
                    }}
                    onLoadSuccess={this.onDocumentLoaded.bind(this)}
                    error={<Gh1 glitchtype="1">❌</Gh1>}
                    noData={<Gh1 glitchtype="1">⚠️</Gh1>}
                    onLoadError={<Gh1 glitchtype="1">💢</Gh1>}
                    renderMode="canvas"
                > {
                    this.state.loaded
                    ? (
                        <HTMLFlipBook
                            ref={this.flipBook}
                            width={this.state.width * 0.5}
                            height={this.state.height}
                            showCover={this.hasCover()}
                            maxShadowOpacity={0.4}
                            flippingTime={320}
                            //renderOnlyPageLengthChange={true}
                            usePortrait={false}
                            onChangeState={this.onFlipBookChangeState.bind(this)}
                            onInit={this.onFlipBookInit.bind(this)}
                        >{
                            this.hasMergedPairs()
                            ? (
                                Array.from(new Array(this.state.pageCount), (el, index) => {
                                    if (index == 0 && this.hasCover()) {
                                        return (
                                            <div className={`pdfpage page-${index}`} key={`page_${index}`}>
                                                {this.isPagePrepared(index) ? <Page pageIndex={index} width={this.state.width * 0.5} /> : <></>}
                                            </div>
                                        )
                                    }
                                    else {
                                        let rightSide = (index + (this.hasCover() ? 1 : 0)) % 2;
                                        let halfPageClass = "half-page" + (rightSide ? " right" : "");
                                        let pdfPageNum = Math.floor(index * 0.5 + (this.hasCover() ? 0.5 : 0));
                                        return (
                                            <div className={`pdfpage page-${index}`} key={`page_${index}`}>
                                                <div className={halfPageClass}>
                                                    {this.isPagePrepared(index) ? <Page pageIndex={pdfPageNum} width={this.state.width} /> : <></>}
                                                </div>
                                            </div>
                                        );
                                    }
                                })
                            ) : (
                                Array.from(new Array(this.state.pageCount), (el, index) => (
                                    <div className={`pdfpage page-${index}`} key={`page_${index}`}>
                                        {this.isPagePrepared(index) ? <Page pageIndex={index} width={this.state.width * 0.5} /> : <></>}
                                    </div>
                                ))
                            )
                        }
                        </HTMLFlipBook>
                    ) : (
                        <Gh1 glitchtype="1">loading</Gh1>
                    )
                }
                </Document>
            </div>
        );
    }
}