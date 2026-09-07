import { Role } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      phone: string;
      role: Role;
      image?: string | null;
    };
  }
  interface User {
    id: string;
    name: string;
    phone: string;
    role: Role;
    image?: string | null;
  }
}
