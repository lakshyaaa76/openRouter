import { t } from "elysia";

export namespace AuthModel {
    export const signinSchema = t.Object({
        email: t.String(),
        password: t.String()
    })

    export type signinSchema = typeof signinSchema.static;

    export const signinResponseSchema = t.Object({
        message:t.Literal("Signed in Successfully")   
    })

    export type signinResponseSchema = typeof signinResponseSchema.static;

    export const signinFailureSchema = t.Object({
        message: t.Literal("Invalid credentials")
    })
    export type signinFailureSchema = typeof signinFailureSchema.static;

    export const signupSchema = t.Object({
        email: t.String(),
        password: t.String()
    })

    export type signupSchema = typeof signupSchema.static;

    export const signupResponseSchema = t.Object({
        id: t.String()    
    })

    export type signupResponseSchema = typeof signupResponseSchema.static;

    export const signupFailedResponseSchema = t.Object({
        message: t.Literal("Error while signing up")
    })
    export type signupFailedResponseSchema = typeof signupFailedResponseSchema.static;

    export const profileResponseSchema = t.Object({
        credits: t.Number()
    })

    export const profileResponseErrorSchema = t.Object({
        message: t.Literal("Error while fetching user details")
    })
}