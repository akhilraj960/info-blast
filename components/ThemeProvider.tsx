"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { AnimationWrapper } from "./AnimationWrapper"
import { useTheme } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { theme } = useTheme();
  return (
    <NextThemesProvider {...props}>
      <AnimationWrapper wrapperKey={theme}>
        {children}
      </AnimationWrapper>
    </NextThemesProvider>

  )
}
