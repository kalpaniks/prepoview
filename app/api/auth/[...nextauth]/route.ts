import prisma from "@/lib/prisma";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { encrypt } from "@/lib/crypto";
 
const handler = NextAuth({
    adapter : PrismaAdapter(prisma),
    secret : process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt'
    },
    providers : [
        GithubProvider({
            clientId : process.env.GITHUB_ID!,
            clientSecret : process.env.GITHUB_SECRET!
        })
    ],
    callbacks : {
        async signIn({user, account}){
            if(account?.provider === "github" && account.access_token){
                await prisma.user.update({
                    where : {id : user.id },
                    data : {
                        githubId : account.providerAccountId,
                        accessToken : encrypt(account.access_token)
                    },
                });
            }
            return true;
        },
        async session({session, token}){
            session.user.id  = token.sub;
            return session;
        },
    },
});

export {handler as GET, handler as POST }