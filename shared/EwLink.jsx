import React from 'react';
import { useNavigate } from "react-router-dom";

export default function EwLink({to, children}) {
    const navigate = useNavigate();
    return <a onClick={() => navigate(to)}> {children} </a>
}