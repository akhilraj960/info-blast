

import { AnimatePresence, motion, MotionProps, Transition } from 'framer-motion';
import React, { ReactNode, createContext } from 'react';

interface AnimationWrapperProps {
    children: ReactNode;
    initial?: MotionProps['initial'];
    animate?: MotionProps['animate'];
    transition?: Transition;
    wrapperKey?: React.Key;
    className?: string;
}

export const AnimationWrapper: React.FC<AnimationWrapperProps> = ({
    children,
    initial = { opacity: 0 },
    animate = { opacity: 1 },
    transition = { duration: 1 },
    wrapperKey,
    className,
}) => {
    return (
        <AnimatePresence>

            <motion.div
                key={wrapperKey}
                initial={initial}
                animate={animate}
                transition={transition}
                className={className}
            >
                {children}
            </motion.div>
        </AnimatePresence>

    );
};
