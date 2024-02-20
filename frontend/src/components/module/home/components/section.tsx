'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useLayoutEffect, useRef } from 'react';

export function HeroSection() {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <Card ref={cardRef} className="z-50 w-96">
      <CardHeader>
        <CardTitle className="text-xl">Role</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Link href="/user/login" className="p-0">
            <Button className="w-full text-base">User</Button>
          </Link>


          <Link href="/admin/login" className="p-0">
            <Button className="w-full text-base">Admin</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}