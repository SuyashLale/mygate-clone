// Zod validation
import z from "zod";

/**
 *  *Backend Validation
 */

// Sign-up superuser
export const superUserSignUpInput = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(4),
});

// Sign-in superuser
export const superuserSignInInput = z.object({
    email: z.string(),
    password: z.string().min(4),
});

// Sign-up SocietyAdmin
export const societyAdminSignUpInput = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(4),
    societyId: z.string(),
});

// Sign-in SocietyAdmin
export const societyAdminSignInInput = z.object({
    email: z.string(),
    password: z.string().min(4),
});

// Sign-up Resident
export const residentSignUpInput = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(4),
});

// Sign-in Resident
export const residentSignInInput = z.object({
    email: z.string(),
    password: z.string().min(4),
});

// Create Society
export const createSocietyInput = z.object({
    name: z.string(),
    address: z.string(),
});

// Create Society Block
export const createBlockInput = z.object({
    name: z.string(),
    societyId: z.string(),
});

// Create Unit
export const createUnitInput = z.object({
    name: z.string(),
    blockId: z.string(),
    societyId: z.string(),
});
