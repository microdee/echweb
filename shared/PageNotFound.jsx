import React from 'react';
import { usePath } from './hookrouter';

export default function PageNotFound() {
    let location = usePath(false, true);
    console.log("md location: " + location);

    return (
        <p>
            I'm sorry but, <b>{location}</b>, is not a thing.
        </p>
    );
}
