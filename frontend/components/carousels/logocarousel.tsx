"use client";

import { memo, useMemo } from 'react';
import Image from 'next/image';

interface LogoCarouselProps {
    logos: {
        brand_name: string;
        brand_logosrc: string;
        brand_url?: string;
    }[];
}

const LogoCarousel = memo(({ logos }: LogoCarouselProps) => {
    
    // Memoize computed values to prevent re-renders
    const { shouldAnimate, containerClasses, listClasses } = useMemo(() => {
        const shouldAnimate = logos.length >= 9;
        
        return {
            shouldAnimate,
            containerClasses: `w-full inline-flex items-center ${shouldAnimate ? 'justify-start' : 'justify-center'} flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,_transparent_0,_black_35%,_black_65%,_transparent_100%)]`,
            listClasses: `w-fit flex items-center [&_li]:mx-8 ${shouldAnimate ? 'animate-[hr-slide_20s_linear_infinite]' : ''}`
        };
    }, [logos.length]);

    // Memoize logo items to prevent re-rendering individual items
    const logoItems = useMemo(() => {
        return logos.map((logo) => {
            const key = logo.brand_logosrc || logo.brand_name;
            
            return (
                <li key={key} className="relative w-fit h-fit" aria-label={logo.brand_name}>
                    <a href={logo.brand_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative w-fit h-fit focus:outline-none"
                    >
                        <Image
                            src={logo.brand_logosrc}
                            alt={logo.brand_name}
                            width={300}
                            height={100}
                            quality={100}
                            draggable="false"
                            loading="lazy"
                            className="w-auto max-w-[250px] h-[60px] object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-95 transition-[filter,_opacity] duration-100"
                        />
                    </a>
                </li>
            );
        });
    }, [logos]);

    if (logos.length === 0) {
        return null;
    }

    return (
        <div className={containerClasses}>
            <ul className={listClasses}>
                {logoItems}
            </ul>
            {shouldAnimate && (
                <ul className={listClasses} aria-hidden="true">
                    {logoItems}
                </ul>
            )}
        </div>
    );
});

LogoCarousel.displayName = "LogoCarousel";

export default LogoCarousel;

// client-side version for better re-render control
export { default as LogoCarouselClient } from './logocarousel-client';
