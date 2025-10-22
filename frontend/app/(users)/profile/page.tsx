'use client';

import { useUserProfile } from '@/hooks/use-user-dashboard';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { userApi } from '@/lib/api';

export default function ProfilePage() {
    const currentUser = useCurrentUser();
    const { data: session, update: updateSession } = useSession();
    const { profile, loading, error, refreshProfile } = useUserProfile();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Form refs for input values
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const newsletterRef = useRef<HTMLInputElement>(null);

    const handleSaveProfile = async () => {
        if (!profile || !session?.user?.id) return;

        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            // Validate required fields
            const firstName = firstNameRef.current?.value?.trim();
            const lastName = lastNameRef.current?.value?.trim();

            if (!firstName || !lastName) {
                setSaveError('First name and last name are required');
                setIsSaving(false);
                return;
            }

            // Basic phone validation (optional)
            const phone = phoneRef.current?.value?.trim();
            if (phone && !/^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/\s/g, ''))) {
                setSaveError('Please enter a valid phone number');
                setIsSaving(false);
                return;
            }

            const updatedData = {
                firstName,
                lastName,
                phone: phone || null,
                newsletterOptIn: newsletterRef.current?.checked ?? profile.newsletterOptIn,
            };

            // For now, we'll simulate the update since we don't have proper JWT tokens
            // TODO: Replace with actual API call when backend integration is complete
            
            /* Uncomment when backend JWT tokens are properly implemented:
            const token = await getToken({ req: { headers: { cookie: document.cookie } } });
            if (token) {
                await userApi.updateProfile(session.user.id, updatedData, token as string);
            }
            */
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update the session with new data
            await updateSession({
                user: {
                    ...session.user,
                    firstName: updatedData.firstName,
                    lastName: updatedData.lastName,
                    phone: updatedData.phone,
                    newsletter_opt_in: updatedData.newsletterOptIn,
                }
            });

            setSaveSuccess(true);
            setIsEditing(false);
            
            // Refresh profile data
            refreshProfile();
            
            // Clear success message after 3 seconds
            setTimeout(() => setSaveSuccess(false), 3000);

        } catch (err) {
            console.error('Error updating profile:', err);
            setSaveError(err instanceof Error ? err.message : 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setSaveError(null);
        setSaveSuccess(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isSaving) {
            e.preventDefault();
            handleSaveProfile();
        } else if (e.key === 'Escape') {
            handleCancelEdit();
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center py-8">
                        <div className="text-red-600 mb-4">Error loading profile</div>
                        <p className="text-gray-600">{error}</p>
                        <Link href="/dashboard" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Profile
                    </h1>
                    <p className="text-gray-600">
                        Manage your personal information and account settings.
                    </p>
                </div>

                {/* Profile Information */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Personal Information
                        </h2>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            disabled={isSaving}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>

                    {profile && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name
                                </label>
                                {isEditing ? (
                                    <input
                                        ref={firstNameRef}
                                        type="text"
                                        defaultValue={profile.firstName}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onKeyDown={handleKeyPress}
                                        required
                                    />
                                ) : (
                                    <p className="text-gray-900 py-2">{profile.firstName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name
                                </label>
                                {isEditing ? (
                                    <input
                                        ref={lastNameRef}
                                        type="text"
                                        defaultValue={profile.lastName}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onKeyDown={handleKeyPress}
                                        required
                                    />
                                ) : (
                                    <p className="text-gray-900 py-2">{profile.lastName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <p className="text-gray-900 py-2">{profile.email}</p>
                                <p className="text-xs text-gray-500">Email cannot be changed</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone
                                </label>
                                {isEditing ? (
                                    <input
                                        ref={phoneRef}
                                        type="tel"
                                        defaultValue={profile.phone || ''}
                                        placeholder="Enter phone number"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onKeyDown={handleKeyPress}
                                    />
                                ) : (
                                    <p className="text-gray-900 py-2">{profile.phone || 'Not provided'}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Account Type
                                </label>
                                <p className="text-gray-900 py-2 capitalize">{profile.userType}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reward Points
                                </label>
                                <p className="py-2 text-green-600 font-medium">
                                    {profile.rewardPoints || 0} points
                                </p>
                            </div>
                        </div>
                    )}

                    {saveError && (
                        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                            {saveError}
                        </div>
                    )}

                    {saveSuccess && (
                        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
                            Profile updated successfully!
                        </div>
                    )}

                    {isEditing && (
                        <div className="mt-6 pt-6 border-t">
                            <div className="flex space-x-4">
                                <button 
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    disabled={isSaving}
                                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Account Settings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                        Account Settings
                    </h2>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900">Newsletter Subscription</h3>
                                <p className="text-sm text-gray-600">Receive updates about new products and offers</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    ref={newsletterRef}
                                    type="checkbox" 
                                    defaultChecked={profile?.newsletterOptIn || false}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-gray-900">Account Status</h3>
                                <p className="text-sm text-gray-600">Your account is currently active</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                Active
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}