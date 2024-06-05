'use client'
import { Wrapper } from '@/components/Wrapper'
import Image from 'next/image'
import notFound from '../public/404.png'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { AnimationWrapper } from '@/components/AnimationWrapper'

export default function NotFound() {
    return <>
        <AnimationWrapper>
            <Wrapper className='flex flex-col items-center justify-center gap-10'>
                <Image src={notFound} alt='not found' className='w-56 h-56 rounded-md' />
                <h2 className='text-4xl font-semibold'>Sorry Page Not Found</h2>
                <Link href="/" className={cn(buttonVariants({ variant: 'link', }))}>Go back to Home</Link>
            </Wrapper>
        </AnimationWrapper>

    </>
}