'use client';

import { useState, useEffect, memo } from 'react';
import LogoCarousel from './logocarousel';
import axios from '@/utils/axios/axios';
import axiosErrorLogger from '@/components/error/axios_error';

interface LogoData {
    brand_name: string;
    brand_logosrc: string;
    brand_url?: string;
}

const LogoCarouselClient = memo(() => {
    const [logos, setLogos] = useState<LogoData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchLogos = async () => {
            try {
                const response = await axios.get('/api/landingpage/ourclients');
                const clientsData = response.data.ourclientsdata || [];
                
                if (isMounted) {
                    setLogos(clientsData);
                }
            } catch (error: any) {
                axiosErrorLogger({ error });
                if (isMounted) {
                    setLogos([]);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchLogos();

        return () => {
            isMounted = false;
        };
    }, []);

    if (isLoading) {
        return (
            <div className="w-full h-[80px] flex justify-center items-center">
                <div className="w-5 h-5 border-2 border-stone-400 border-t-stone-800 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (logos.length === 0) {
        return null;
    }

    return <LogoCarousel logos={logos} />;
});

LogoCarouselClient.displayName = "LogoCarouselClient";

export default LogoCarouselClient;
