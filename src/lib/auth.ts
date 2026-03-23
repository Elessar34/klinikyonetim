import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import prisma from "@/lib/db"
import type { UserRole } from "@/generated/prisma/client"

declare module "next-auth" {
  interface User {
    id: string
    role: UserRole
    tenantId: string
    tenantSlug: string
    tenantName: string
    businessType: string
    firstName: string
    lastName: string
  }

  interface Session {
    user: User & {
      id: string
      role: UserRole
      tenantId: string
      tenantSlug: string
      tenantName: string
      businessType: string
      firstName: string
      lastName: string
    }
  }
}

declare module "next-auth" {
  interface JWT {
    id: string
    role: UserRole
    tenantId: string
    tenantSlug: string
    tenantName: string
    businessType: string
    firstName: string
    lastName: string
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/giris",
    newUser: "/kayit",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email ve şifre gereklidir")
        }

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
            isActive: true,
          },
          include: {
            tenant: {
              select: {
                id: true,
                name: true,
                slug: true,
                businessType: true,
                isActive: true,
                subscriptionStatus: true,
              },
            },
          },
        })

        if (!user) {
          throw new Error("Geçersiz email veya şifre")
        }

        if (!user.tenant.isActive) {
          throw new Error("Bu işletme hesabı devre dışıdır")
        }

        if (user.tenant.subscriptionStatus === "EXPIRED") {
          throw new Error("Abonelik süresi dolmuştur")
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isPasswordValid) {
          throw new Error("Geçersiz email veya şifre")
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: {
            lastLoginAt: new Date(),
          },
        })

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          tenantId: user.tenant.id,
          tenantSlug: user.tenant.slug,
          tenantName: user.tenant.name,
          businessType: user.tenant.businessType,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.tenantId = user.tenantId
        token.tenantSlug = user.tenantSlug
        token.tenantName = user.tenantName
        token.businessType = user.businessType
        token.firstName = user.firstName
        token.lastName = user.lastName
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
        session.user.tenantId = token.tenantId as string
        session.user.tenantSlug = token.tenantSlug as string
        session.user.tenantName = token.tenantName as string
        session.user.businessType = token.businessType as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
      }
      return session
    },
  },
})
