'use server'

import { lucia, validateRequest } from "@/lib/auth";
import db, { usersDb } from "@/lib/db/drizzle";
import { columnsRegex, TRoles } from "@/types/index.types";
import { TLoginSchema } from "@/types/auth.types";
import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { userTable } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

type TRegister = {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    password: string;
    role: TRoles;
}

export async function register(data: TRegister) {
    if (!data) return;

    const { id, firstname, lastname, email, phone, password, role } = data;

    const user = await db.insert(userTable).values({
        id,
        firstname,
        lastname,
        email,
        phone,
        password,
        role
    }).returning({ id: userTable.id }).execute();

    return user;
}

export async function login(data: TLoginSchema) {
    const { credential, password } = data;

    const isEmail = columnsRegex.email.test(credential);
    const isPhoneNumber = columnsRegex.phone.test(credential);

    let column: 'email' | 'phone';
    if (isEmail) {
        column = 'email'
    } else if (isPhoneNumber) {
        column = 'phone'
    } else {
        return {
            error: `Invalid Credential`
        }
    }

    const [existingUser] = await usersDb.select().from(userTable).where(eq(userTable[column], credential));

    const existingUserInDb = await db.query.userTable.findFirst({
        where: (userTable: { [key: string]: any }, funcs) => funcs.eq(userTable[column], credential),
    });

    if (existingUser) {
        const validPassword = await verify(existingUser.password, password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1,
        });

        if (!validPassword) {
            return {
                error: 'Invalid Password'
            }
        }

        let user;
        if (!existingUserInDb) {
            user = await register(existingUser);
        }

        const userId = existingUserInDb ? existingUserInDb.id : user[0].id;


        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes,
        );
        return redirect("/");
    } else {
        return {
            error: `Invalid ${column == 'phone' ? 'phone number' : 'email'} or password`
        }
    }
}

export async function logout() {
    const { session } = await validateRequest();
    if (!session) {
        return {
            error: "Unauthorized"
        };
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return redirect("/auth");
}