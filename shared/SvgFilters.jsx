import React from 'react';
import CartoonWiggleFilter from './filters/CartoonWiggleFilter';
import GlitchFilter from './filters/GlitchFilter';

export default function SvgFilters() {
    return (
        <svg
            version="1.2"
            baseProfile="tiny"
            xmlns="http://www.w3.org/2000/svg"
            overflow="visible"
            style={{
                position:"absolute", height:0
            }}
        >
            <GlitchFilter id="glitch_Analog" type="analog" baseSeed={10} scale={30} />
            <GlitchFilter id="glitch_AnalogBig" type="analog" baseSeed={21} scale={70} />
            <GlitchFilter id="glitch_AnalogSubtle" type="analog" baseSeed={32} scale={5} analogSpeed={3} />
            <GlitchFilter id="glitch_Digital" type="digital" baseSeed={100} scale={30} />
            <GlitchFilter id="glitch_DigitalBig" type="digital" baseSeed={111} scale={100} />
            <GlitchFilter id="glitch_DigitalSubtle" type="digital" baseSeed={122} scale={6} />

            <CartoonWiggleFilter id="cartoonWiggle" />
        </svg>
    )
}