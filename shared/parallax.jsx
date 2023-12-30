
export default class ParallaxEffect
{
    constructor()
    {
        this.root = null;

        this.prevTimestamp = 0.0;
        this.antiHisteresys = 4000.0;
        this.perfCounter = 0.0;
        this.frameMs = 0.0;
        this.lowPerfMode = false;
        this.transitionMs = 1000.0;
        this.transitionPeriod = 0.0;
        this.unclipped = false;
        this.wasConnectedOnce = false;
        this.assumeDisconnected = false;

        this.dependencies = {
            rootHeight: 1,
            vpHeight: 0,
            vpWidth: 0,
            elemHeight: 0,
            coeff: 0
        }
        this.viewProgressTimeline = null;
        this.animations = [];
    }

    isValid(refElement)
    {
        if (this.assumeDisconnected) return false;
        if (refElement.isConnected) {
            this.wasConnectedOnce = true;
            return true;
        }
        if (this.wasConnectedOnce) {
            this.assumeDisconnected = true;
            return false;
        }
        return true;
    }

    absTop(el, t)
    {
        return  el == this.root || !el
            ? t
            : this.absTop(el.offsetParent, t + el.offsetTop);
    }

    determinePerfMode(timestamp)
    {
        let prevPerfCounter = this.perfCounter;
        if(this.prevTimestamp == 0) {
            this.prevTimestamp = timestamp;
        }
        this.frameMs = timestamp - this.prevTimestamp;
        if (window.document.hasFocus()) {
            this.perfCounter += this.frameMs > 33.33 ? -this.frameMs : this.frameMs * 0.1;
        }
        if(Math.abs(this.perfCounter) >= this.antiHisteresys)
        {
            this.lowPerfMode = this.perfCounter < 0;
        }
        this.prevTimestamp = timestamp;
    }

    getParallaxCoeff(refElement)
    {
        let coeffStr = getComputedStyle(refElement).getPropertyValue('--parallax-coeff');
        if (refElement.hasAttribute("parallaxcoeff"))
            coeffStr = refElement.getAttribute("parallaxcoeff");
        let result = Math.max(parseFloat(coeffStr), 0);
        return result;
    }

    registerWithAnimFrame(refElement)
    {
        this.root = document.getElementById("root");

        let animBody = (timestamp => {
            if (!this.isValid(refElement)) return;
            if(refElement) {
                this.determinePerfMode(timestamp);
                if(this.lowPerfMode) {
                    refElement.style.transition = `transform ${this.transitionMs}ms ease-in-out`;
                    refElement.style.transform = "translateY(0px)";
                    this.transitionPeriod = this.transitionMs;
                }
                else {
                    if(this.transitionPeriod < 0)
                    {
                        refElement.style.transition = "none";
                    }
                    this.transitionPeriod -= this.frameMs;
                    let coeff = 1 - this.getParallaxCoeff(refElement);
                    let top = this.absTop(refElement, 0);
                    let value = (this.root.scrollTop - top + (this.root.clientHeight - refElement.offsetHeight) * 0.5) * coeff;

                    refElement.style.transform = `translateY(${value}px)`;
                }
                if (this.isValid(refElement)) window.requestAnimationFrame(animBody.bind(this));
            }
        });
        window.requestAnimationFrame(animBody.bind(this));
    }

    updateTimeline(refElement)
    {
        if (this.animations.length > 0) {
            this.animations.forEach(a => a.cancel());
            this.animations = [];
            this.viewProgressTimeline = null;
        }

        let coeff = 1 - (this.dependencies.coeff || 0);
        let elHeight = this.dependencies.elemHeight;
        let beginOffs = this.dependencies.vpHeight * 0.5 + elHeight * 0.5;
        let endOffs = - this.dependencies.vpHeight * 0.5 - elHeight * 0.5;
        this.viewProgressTimeline = new ViewTimeline({
            subject: refElement
        });
        let prevTr = refElement.style.transform ?? "";
        this.animations.push(
            refElement.animate([
                { transform: `${prevTr} translateY(${-beginOffs * coeff}px)`, offset: 0 },
                { transform: `${prevTr} translateY(${-endOffs * coeff}px)`, offset: 1 },
            ], {
                timeline: this.viewProgressTimeline,
                rangeStart: 'cover 0%',
                rangeEnd: 'cover 100%',
            })
        );
        if (!this.unclipped) {
            this.animations.push(
                refElement.animate([
                    { opacity: 0, offset: 0 },
                    { opacity: 1, offset: 0.15 },
                    { opacity: 1, offset: 0.85 },
                    { opacity: 0, offset: 1 },
                ], {
                    timeline: this.viewProgressTimeline,
                    rangeStart: 'cover 0%',
                    rangeEnd: 'cover 100%',
                })
            );
        }
     }

    getNewDependencies(refElement)
    {
        let result = {
            rootHeight: this.root.scrollHeight,
            vpHeight: window.innerHeight,
            vpWidth: window.innerWidth,
            elemHeight: refElement.offsetHeight,
            coeff: this.getParallaxCoeff(refElement)
        };
        return result;
    }

    checkDependencies(prev, current)
    {
        return prev.rootHeight != current.rootHeight
            || prev.vpHeight != current.vpHeight
            || prev.vpWidth != current.vpWidth
            || prev.elemHeight != current.elemHeight
            || prev.coeff != current.coeff;
    }

    registerWithScrollAnimTimeline(refElement)
    {
        this.root = document.getElementById("root");

        this.dependencies = this.getNewDependencies(refElement);
        this.updateTimeline(refElement);
        
        let animBody = (timestamp => {
            if (!this.isValid(refElement)) return;

            let current = this.getNewDependencies(refElement);
            if (this.checkDependencies(this.dependencies, current)) {
                this.dependencies = current;
                this.updateTimeline(refElement);
            }
            if (this.isValid(refElement))
                window.requestAnimationFrame(animBody.bind(this));
        });

        window.requestAnimationFrame(animBody.bind(this));
    }

    register(refElement, unclipped)
    {
        if (unclipped) {
            this.unclipped = true;
        }
        try {
            this.registerWithScrollAnimTimeline(refElement);
        } catch (e) {
            console.log("Browser didn't support ViewTimeline, there will be no parallax");
            console.log(e);
        }
    }
}