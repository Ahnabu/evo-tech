"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useIsMobile } from '@/hooks/use-mobile';
import { HiHome } from "react-icons/hi2";
import { FaEllipsis } from "react-icons/fa6";

export function AdminDynamicBreadcrumbs() {

  const pathname = usePathname();
  const isMobile = useIsMobile();
  const refinedPathSegments = pathname.split("/").filter(Boolean).slice(1, 4); // specific parts of admin routes only, upto 3 segments for now

  // if no segments to display
  if (refinedPathSegments.length === 0) {
    return null;
  }

  // create the paths for each segment
  const paths = refinedPathSegments.map((segment, index) => {
    const path = `/control/${refinedPathSegments.slice(0, index + 1).join('/')}`;
    let label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

    // for orders, the segment is a number only.
    const isNumericSegment = /^[0-9]+$/.test(segment);
    if (path.startsWith('/control/orders/') && index === 1 && isNumericSegment) {
      label = `#${segment}`;
    }

    return {
      label: label,
      path,
    };
  });

  return (
    <Breadcrumb className="">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/control/dashboard">
              <HiHome className="size-[0.875rem]" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {paths.map((item, index) => {
          if (isMobile) {
            return (
              <BreadcrumbItem key={item.path}>
                {
                  (index === 0) && (
                    <>
                      <BreadcrumbLink asChild>
                        <Link href={item.path} className='text-[0.6875rem] leading-3 font-inter text-stone-700 hover:text-stone-900' >{item.label}</Link>
                      </BreadcrumbLink>
                      <BreadcrumbSeparator />
                    </>
                  )
                }
                {
                  (paths.length > 2 && index === 1) && (
                    <>
                      <BreadcrumbPage className='text-[0.6875rem] leading-3 font-inter' >
                        <FaEllipsis className="size-3 text-stone-700" />
                      </BreadcrumbPage>
                      <BreadcrumbSeparator />
                    </>
                  )
                }
                {
                  (index === paths.length - 1) && (
                    <BreadcrumbPage className='text-[0.6875rem] leading-3 font-inter' >{item.label}</BreadcrumbPage>
                  )
                }
              </BreadcrumbItem>
            )
          } else {
            return (
              <BreadcrumbItem key={item.path}>
                {index === paths.length - 1 ? (
                  <BreadcrumbPage className='text-[0.6875rem] leading-3 font-inter' >{item.label}</BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink asChild>
                      <Link href={item.path} className='text-[0.6875rem] leading-3 font-inter text-stone-700 hover:text-stone-900' >{item.label}</Link>
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                )}
              </BreadcrumbItem>
            )
          }
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
