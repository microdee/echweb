import React from 'react';
import ParallaxEffect from './parallax';
import MdFullParallaxWrap from './MdFullParallaxWrap';
import parseMetaObject from './AltMeta';

export default class MdImg extends React.Component {
    constructor(props) {
        super(props);
        this.meta = {};
        this.hasParallax = false;
        this.isSideParallax = false;
        this.parallax = new ParallaxEffect();
        this.mainImg = React.createRef();

        let alt = (props.alt ?? "");
        if (alt.length > 0 && alt[0] == '_')
        {
            alt = alt.substring(1);
            this.meta = parseMetaObject(alt);
            this.hasParallax = "parallax" in this.meta;
            console.log(this.meta);
    
            if(this.hasParallax) {
                this.isSideParallax = "side" in this.meta.parallax;
            }
        }
    }

    componentDidMount() {
        if(this.hasParallax && this.mainImg?.current) {
            this.parallax.register(this.mainImg.current, "full" in this.meta);
        }
    }

    render() {
        let propsCopy = {...this.props};
        let caption = this.meta.caption ?? "";
        let noBlur = "noBlur" in this.meta;
        let optionals = {};
        let classes = propsCopy.className ?? "";

        propsCopy.style = propsCopy.style ?? {};
        delete propsCopy.className;

        ["expand", "center", "notInArticle", "invert", "desaturate"].forEach(f => {
            if (f in this.meta) {
                classes += " " + f;
            }
        });

        if (this.isSideParallax) {
            classes += " sideParallax";
        }

        if ("parallax" in this.meta && "coeff" in this.meta.parallax) {
            optionals = {...optionals, parallaxcoeff: parseFloat(this.meta.parallax.coeff)};
        }

        if ("filter" in this.meta) {
            propsCopy.style.filter = (
                (propsCopy.style.filter ?? "") + " " + this.meta.filter
            ).trim();
        }

        if ("transform" in this.meta) {
            propsCopy.style.transform = (
                (propsCopy.style.transform ?? "") + " " + this.meta.transform
            ).trim();
        }

        if ("style" in this.meta) {
            propsCopy.style = {...propsCopy.style, ...this.meta.style};
        }

        if ("zindex" in this.meta) {
            propsCopy.style.position = "relative";
            propsCopy.style.zIndex = this.meta.zindex;
        }

        if("full" in this.meta)
        {
            if ("fit" in this.meta) {
                classes += " fit";
            }
            return (<div className="mdCaptionWrap">
                <MdFullParallaxWrap noblur={noBlur} {...optionals}>
                    <img {...propsCopy} className={classes.trim()}/>
                </MdFullParallaxWrap>
                {
                    caption.length > 0
                    ? (<>
                        <div className="imgCaptionPre"></div>
                        <span className="imgCaption">{caption}</span>
                        <div className="imgCaptionPost"></div>
                    </>) : <></>
                }
            </div>);
        }
        else
        {
            return <img ref={this.mainImg} {...propsCopy} className={classes.trim()} {...optionals} />;
        }
    }
}