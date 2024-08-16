import { z } from "zod";

export const loginSchema = z.object({
    credential: z.string().min(1, 'Credential is required'),
    password: z.string().min(1, 'Password is required'),
})

export type TLoginSchema = z.infer<typeof loginSchema>