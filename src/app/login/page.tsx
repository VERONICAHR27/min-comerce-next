'use client';

import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { redirect } from "next/navigation";

export default function SignInPage() {

    const { data: session } = useSession()
    if (!!session) {
        redirect("/")
    }


    return (
        <main className="p-24 flex justify-center">
            <Card className="max-w-2xl">
                <CardContent>
                    <section className="flex flex-col gap-4">
                        <Button size={"sm"} variant={"outline"} onClick={() => signIn("google")}>Continuar con Google</Button>
                        <Button size={"sm"} variant={"outline"} onClick={() => signIn("github")}>Continuar con Github</Button>
                    </section>
                </CardContent>
            </Card>
        </main>
    )
}