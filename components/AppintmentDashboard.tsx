'use client';

import { ErrorDisplay } from './error-display';
import { AppointmentSkeleton } from './loading-skeleton';
import AccountDropdown from '@/components/account-dropdown';
import AppointmentCard from '@/components/appointment-card';
import { Spinner } from '@/components/spinner';
import { getPastAppointments, getUpcomingAppointments } from '@/lib/data-utils';
import type { MockData } from '@/lib/types';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface AppointmentDashboardProps {
  initialData: MockData;
}

export default function AppointmentDashboard({ initialData }: AppointmentDashboardProps) {
  const [data, setData] = useState<MockData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upcomingAppointments = getUpcomingAppointments(data.appointments);
  const pastAppointments = getPastAppointments(data.appointments);
  const user = {
    name: data.user.name,
    bookings: data.user.bookings,
    spent: data.user.totalSpent,
    avatar: '',
  };

  // Function to refresh data using the API route
  const refreshData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate longer loading for better UX demonstration
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Use fetch to call our API route
      const response = await fetch('/api/appointments');

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const freshData = await response.json();
      setData(freshData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  // If there's an error, show error display
  if (error) {
    return (
      <div className="flex-1">
        <header className="bg-gradient-header sticky top-0 z-10 flex h-[94px] items-center justify-between px-4 lg:pl-8 lg:pr-20">
          <button className="flex items-center text-gray-400 transition-colors hover:text-white">
            <span className="bg-black-03 mr-2.5 flex h-3.5 w-3.5 items-center justify-center rounded-full">
              <ChevronLeft className="color-white-04 h-2 w-2" />
            </span>
            <span className="text-gray-04 text-body-16">back to malik</span>
          </button>
        </header>

        <div className="container mt-12">
          <ErrorDisplay message={error} onRetry={refreshData} isRetrying={isLoading} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 pb-6">
      {/* Header */}
      <header className="bg-gradient-header sticky top-0 z-10 flex h-[94px] items-center justify-between px-4 lg:pl-8 lg:pr-20">
        <button className="flex items-center text-gray-400 transition-colors hover:text-white">
          <span className="bg-black-03 mr-2.5 flex h-3.5 w-3.5 items-center justify-center rounded-full">
            <ChevronLeft className="color-white-04 h-2 w-2" />
          </span>
          <span className="text-gray-04 text-body-16">back to malik</span>
        </button>

        <div className="flex h-10 items-center gap-4">
          <button className="relative flex w-10 items-center justify-center">
            <Image
              src="/img/bell.svg"
              alt="Notification icon"
              width={15}
              height={16}
              className="object-cover"
            />
            <span className="bg-gold-02 absolute left-[21px] top-0 h-1.5 w-1.5 rounded-full"></span>
          </button>
          <div className="flex items-center gap-2">
            <AccountDropdown user={user} />
          </div>
        </div>
      </header>

      {/* Coming up section */}
      <section className="container mb-[72px]">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-h1 text-white-02">coming up.</h2>
          {/* Refresh button with spinner */}
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="bg-gray-06 text-black-01 text-title-14 flex h-[37px] w-[140px] items-center justify-center rounded-full px-6 hover:bg-gray-200 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Spinner />
                <span>Refreshing</span>
              </>
            ) : (
              'Refresh'
            )}
          </button>
        </div>

        {isLoading ? (
          // Show skeleton loaders when refreshing
          <>
            <AppointmentSkeleton />
            <AppointmentSkeleton />
          </>
        ) : upcomingAppointments.length > 0 ? (
          upcomingAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border-gray-07 flex flex-wrap items-start justify-between gap-4 border-t py-12"
            >
              <AppointmentCard appointment={appointment} />

              <div className="flex gap-2 md:flex-col">
                <button className="bg-gray-06 text-black-01 text-title-14 h-[37px] w-[140px] rounded-full px-6 hover:bg-gray-200">
                  rebook
                </button>
                <button className="text-gray-06 bg-black-03 text-title-14 h-[37px] w-[140px] rounded-full px-6 hover:bg-gray-800">
                  call {appointment.barber.toLowerCase()}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="border-gray-07 border-t py-8 text-gray-400">No upcoming appointments</p>
        )}
      </section>

      {/* Past section */}
      <section className="container">
        <h2 className="text-h1 text-white-02 mb-10">past.</h2>

        {isLoading ? (
          // Show skeleton loaders when refreshing
          <>
            <AppointmentSkeleton />
            <AppointmentSkeleton />
          </>
        ) : pastAppointments.length > 0 ? (
          pastAppointments.map((appointment) => (
            <div key={appointment.id} className="border-gray-07 border-t py-12">
              <AppointmentCard appointment={appointment} showMoreOptions />
            </div>
          ))
        ) : (
          <p className="border-gray-07 border-t py-8 text-gray-400">No past appointments</p>
        )}
      </section>
    </div>
  );
}
