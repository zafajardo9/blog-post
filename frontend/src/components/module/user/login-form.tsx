'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"


import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import * as z from 'zod';

import { BiLoaderAlt } from 'react-icons/bi';

import { zodResolver } from '@hookform/resolvers/zod';


import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLayoutEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { userLoginFormSchema } from "./validation";
import { useToast } from "@/components/ui/use-toast";
import { USER_ROLE } from '@/lib/constants';


import Link from 'next/link';

export function LoginForm() {
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof userLoginFormSchema>>({
    resolver: zodResolver(userLoginFormSchema),
    shouldFocusError: false,
    defaultValues: {
      role: USER_ROLE.USER,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof userLoginFormSchema>) => {
    const response = await signIn('credentials', {
      redirect: false,
      ...values,
      role: USER_ROLE.USER,
    });

    if (response?.error) {
      toast({
        title: 'Login Failed',
        description: response.error,
        variant: 'destructive',
      });
    }

    if (response?.ok) {
      toast({
        title: 'Login Success',
      });

      router.push('/user/home');
    }

    return;
  };

    return (
      <Card ref={cardRef} className="z-20 w-96 rounded">
        <CardHeader>
          <CardTitle className="text-xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Username here"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password here"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <Button
                type="submit"
                className="w-full text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="h-fit w-fit animate-spin">
                    <BiLoaderAlt />
                  </span>
                ) : (
                  'Login'
                )}
              </Button>


              {/* <Link href="/user/register" className="p-0">
                <Button variant="destructive" className="w-full text-lg mt-2">Register</Button>
              </Link> */}
  
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }