import { z } from "zod";

const userSignUpSchema = z.object({
  userName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  passwords: z
    .object({
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long") // Simplified length check
        .regex(/[A-Z]/, "Must contain at least one uppercase letter") // Removed complexity
        .regex(/[a-z]/, "Must contain at least one lowercase letter") // Removed complexity
        .regex(/\d/, "Must contain at least one number") // Removed complexity
        .regex(/[@$!%*?&]/, "Must contain at least one special character"), // Removed complexity
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match.",
      path: ["confirmPassword"], // Error displayed on the confirmPassword field
    }),
});

const shopOwnerSignUpSchema = z.object({
  userName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  passwords: z
    .object({
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long") // Simplified length check
        .regex(/[A-Z]/, "Must contain at least one uppercase letter") // Removed complexity
        .regex(/[a-z]/, "Must contain at least one lowercase letter") // Removed complexity
        .regex(/\d/, "Must contain at least one number") // Removed complexity
        .regex(/[@$!%*?&]/, "Must contain at least one special character"), // Removed complexity
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match.",
      path: ["confirmPassword"], // Error displayed on the confirmPassword field
    }),
  shopName: z.string().min(1, "Shop name is required"),
});

const ownedPetSchema = z.object({
  petName: z.string().min(1, "Pet name is required"),
  aboutPet: z
    .string()
    .min(1, "Pet about is required")
    .max(200, "Pet about cannot exceed 200 words"),
});

const updatePasswordSchema = z.object({
  passwords: z
    .object({
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long") // Simplified length check
        .regex(/[A-Z]/, "Must contain at least one uppercase letter") // Removed complexity
        .regex(/[a-z]/, "Must contain at least one lowercase letter") // Removed complexity
        .regex(/\d/, "Must contain at least one number") // Removed complexity
        .regex(/[@$!%*?&]/, "Must contain at least one special character"), // Removed complexity
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match.",
      path: ["confirmPassword"], // Error displayed on the confirmPassword field
    }),
});

export { userSignUpSchema, shopOwnerSignUpSchema, ownedPetSchema ,updatePasswordSchema};
