"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResidentInput = exports.createUnitInput = exports.createBlockInput = exports.createSocietyInput = exports.residentSignInInput = exports.residentSignUpInput = exports.societyAdminSignInInput = exports.societyAdminSignUpInput = exports.superuserSignInInput = exports.superUserSignUpInput = void 0;
// Zod validation
const zod_1 = __importDefault(require("zod"));
/**
 *  *Backend Validation
 */
// Sign-up superuser
exports.superUserSignUpInput = zod_1.default.object({
    name: zod_1.default.string(),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(4),
});
// Sign-in superuser
exports.superuserSignInInput = zod_1.default.object({
    email: zod_1.default.string(),
    password: zod_1.default.string().min(4),
});
// Sign-up SocietyAdmin
exports.societyAdminSignUpInput = zod_1.default.object({
    name: zod_1.default.string(),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(4),
    societyId: zod_1.default.string(),
});
// Sign-in SocietyAdmin
exports.societyAdminSignInInput = zod_1.default.object({
    email: zod_1.default.string(),
    password: zod_1.default.string().min(4),
});
// Sign-up Resident
exports.residentSignUpInput = zod_1.default.object({
    name: zod_1.default.string(),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(4),
});
// Sign-in Resident
exports.residentSignInInput = zod_1.default.object({
    email: zod_1.default.string(),
    password: zod_1.default.string().min(4),
});
// Create Society
exports.createSocietyInput = zod_1.default.object({
    name: zod_1.default.string(),
    address: zod_1.default.string(),
});
// Create Society Block
exports.createBlockInput = zod_1.default.object({
    name: zod_1.default.string(),
    societyId: zod_1.default.string(),
});
// Create Unit
exports.createUnitInput = zod_1.default.object({
    name: zod_1.default.string(),
    blockId: zod_1.default.string(),
    societyId: zod_1.default.string(),
});
// Create Resident
exports.createResidentInput = zod_1.default.object({
    email: zod_1.default.string().email(),
    name: zod_1.default.string(),
    societyId: zod_1.default.string(),
    blockId: zod_1.default.string(),
    unit: zod_1.default.string(),
});
