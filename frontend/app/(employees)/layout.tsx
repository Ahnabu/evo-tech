import { PropsWithChildren } from 'react';

export default function EmployeeLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-gray-50">
            {children}
        </div>
    );
}