import React from 'react';
import {Routes, Route } from 'react-router-dom';
import Index from './Index';
export default function App()
{
    return (
        <Routes>
            <Route path="/" index element={<Index></Index>}></Route>
        </Routes>
    )
}