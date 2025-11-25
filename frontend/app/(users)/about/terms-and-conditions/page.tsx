import React from 'react';
import axios from '@/utils/axios/axios';
import axiosErrorLogger from '@/components/error/axios_error';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TermsData {
    _id: string;
    content: string;
    version: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

const getActiveTerms = async (): Promise<TermsData | null> => {
    try {
        const response = await axios.get(`/terms/active`);
        return response.data.data;
    } catch (error: any) {
        axiosErrorLogger({ error });
        return null;
    }
};

const TermsandConditions = async () => {
    const termsData = await getActiveTerms();

    if (!termsData) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <Card>
                    <CardContent className="py-12 text-center">
                        <h1 className="text-2xl font-bold mb-4">Terms and Conditions</h1>
                        <p className="text-stone-600">
                            Terms and conditions are currently being updated. Please check back later.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-3xl font-bold">Terms and Conditions</CardTitle>
                        <Badge variant="secondary">Version {termsData.version}</Badge>
                    </div>
                    <p className="text-sm text-stone-600 mt-2">
                        Last updated: {new Date(termsData.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-stone max-w-none">
                        <div className="whitespace-pre-wrap text-stone-700 leading-relaxed">
                            {termsData.content}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default TermsandConditions;
