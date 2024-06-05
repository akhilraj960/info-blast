'use client';

import React, { useEffect, useState } from 'react';
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import { useTheme } from 'next-themes';
import { AnimationWrapper } from './AnimationWrapper';

export const ThemeMode = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Ensuring that the component is mounted before rendering to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} >
            {theme === 'light' ? <BsFillMoonStarsFill /> : <BsFillSunFill />}
        </button>
    );
};
