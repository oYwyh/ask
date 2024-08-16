'use client'

import { login } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { handleError, normalizeDataFields } from "@/lib/funcs";
import { loginSchema, TLoginSchema } from "@/types/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function AuthPage() {
    const form = useForm<TLoginSchema>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: TLoginSchema) => {

        normalizeDataFields(data)

        const result = await login(data)

        if (result?.error) {
            form.setError('password', { type: "server", message: result.error });
        }
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="credential"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Phone Nubmer or Email" {...field} />
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
                                <FormControl>
                                    <Input placeholder="Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </>
    )
}