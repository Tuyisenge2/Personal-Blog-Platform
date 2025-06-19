"use server";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/actions/auth";

const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
  };
  
  export const registerUser = async (
    username: string,
    email: string,
    password: string,
    is_admin: boolean = false
  ) => {
    try {
      // Check for existing user
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
  
      if (existingUser.length > 0) {
        throw new Error("Email already in use");
      }
  
      const existingUsername = await db
        .select()
        .from(users)
        .where(eq(users.username, username));
  
      if (existingUsername.length > 0) {
        throw new Error("Username already in use");
      }
  
      const hashedPassword = await hashPassword(password);
      const now = new Date();
  
      const [newUser] = await db
        .insert(users)
        .values({
          username,
          email,
          password: hashedPassword,
          is_admin,
          created_at: now,
          updated_at: now,
        })
        .returning();
  
      revalidatePath("/");
      return {
        ...newUser,
        created_at: newUser.created_at ? new Date(newUser.created_at) : now,
        updated_at: newUser.updated_at ? new Date(newUser.updated_at) : now,
      };
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  export const loginUser = async (
    email: string,
    password: string
  ): Promise<{ user?: any; token?: string; error?: string }> => {
    try {
      // Find user by email
      const user = await getUserByEmail(email);
      if (!user) {
        return { error: "Invalid credentials" };
      }
  
      // Compare hashed password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return { error: "Invalid credentials" };
      }
  
      // Generate JWT token
      const token = generateToken(user.id, user.is_admin);
  
      // Return user data (excluding password) and token
      const { password: _, ...userWithoutPassword } = user;
      return { 
        user: userWithoutPassword,
        token 
      };
      
    } catch (error) {
      console.error("Login failed:", error);
      return { error: "Something went wrong" };
    }
  };


//   // Add this to your existing users actions file
// export const loginUser = async (
//     email: string,
//     password: string
//   ): Promise<{ user?: any; error?: string }> => {
//     try {
//       // Find user by email
//       const user = await getUserByEmail(email);
//       if (!user) {
//         return { error: "Invalid credentials" };
//       }
  
//       // Compare hashed password
//       const isValid = await bcrypt.compare(password, user.password);
//       if (!isValid) {
//         return { error: "Invalid credentials" };
//       }
  
//       // Return user data (excluding password)
//       const { password: _, ...userWithoutPassword } = user;
//       return { user: userWithoutPassword };
      
//     } catch (error) {
//       console.error("Login failed:", error);
//       return { error: "Something went wrong" };
//     }
//   };

// Update user profile to match schema
export const updateUser = async (
  id: number, 
  username: string, 
  email: string,
  is_admin?: boolean
): Promise<{ error?: string }> => {
  try {
    await db
      .update(users)
      .set({
        username,
        email,
        is_admin,
        updated_at: new Date(),
      })
      .where(eq(users.id, id));

    revalidatePath("/profile");
    return { error: undefined };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Something went wrong" };
  }
};

// Get all users (for admin purposes)
export const getUsers = async () => {
  const data = await db.select().from(users);
  return data;
};

// Get user by email
export const getUserByEmail = async (email: string) => {
  const user = await db.select().from(users).where(eq(users.email, email));
  return user[0] || null;
};

// Get user by username
export const getUserByUsername = async (username: string) => {
  const user = await db.select().from(users).where(eq(users.username, username));
  return user[0] || null;
};

// Get user by ID
export const getUserById = async (id: number) => {
  const user = await db.select().from(users).where(eq(users.id, id));
  return user[0] || null;
};

// Change user password (unchanged)
export const changePassword = async (
  id: number,
  currentPassword: string,
  newPassword: string
): Promise<{ error?: string }> => {
  try {
    const user = await getUserById(id);
    if (!user) {
      return { error: "User not found" };
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return { error: "Current password is incorrect" };
    }

    const hashedPassword = await hashPassword(newPassword);

    await db
      .update(users)
      .set({
        password: hashedPassword,
        updated_at: new Date(),
      })
      .where(eq(users.id, id));

    revalidatePath("/profile");
    return { error: undefined };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Something went wrong" };
  }
};

// Delete user (unchanged)
export const deleteUser = async (id: number): Promise<{ error?: string }> => {
  try {
    await db.delete(users).where(eq(users.id, id));
    revalidatePath("/admin/users");
    return { error: undefined };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Something went wrong" };
  }
};