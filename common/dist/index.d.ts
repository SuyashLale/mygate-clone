import z from "zod";
/**
 *  *Backend Validation
 */
export declare const superUserSignUpInput: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
}, {
    name: string;
    email: string;
    password: string;
}>;
export declare const superuserSignInInput: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const societyAdminSignUpInput: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    societyId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
    societyId: string;
}, {
    name: string;
    email: string;
    password: string;
    societyId: string;
}>;
export declare const societyAdminSignInInput: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const residentSignUpInput: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
}, {
    name: string;
    email: string;
    password: string;
}>;
export declare const residentSignInInput: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const createSocietyInput: z.ZodObject<{
    name: z.ZodString;
    address: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    address: string;
}, {
    name: string;
    address: string;
}>;
export declare const createBlockInput: z.ZodObject<{
    name: z.ZodString;
    societyId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    societyId: string;
}, {
    name: string;
    societyId: string;
}>;
export declare const createUnitInput: z.ZodObject<{
    name: z.ZodString;
    blockId: z.ZodString;
    societyId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    societyId: string;
    blockId: string;
}, {
    name: string;
    societyId: string;
    blockId: string;
}>;
