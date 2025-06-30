import Link from "next/link";
import { auth } from "@/auth";

interface PageProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const dataTypes = {
    "no_admin": {
        title: "Acceso Denegado",
        message: "Solo los administradores pueden acceder a esta sección.",
        link_label: "Volver a la página de inicio",
        link_url: "/",
    },
    "no_session": {
        title: "Acceso Denegado",
        message: "Debes iniciar sesión como usuario para acceder a esta página.",
        link_label: "Iniciar sesión",
        link_url: "/login",
    },
    "expired": {
        title: "Acceso Denegado",
        message: "Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.",
        link_label: "Iniciar sesión",
        link_url: "/login",
    },
    "insufficient_permissions": {
        title: "Permisos Insuficientes",
        message: "Tu rol actual no tiene permisos para acceder a esta sección.",
        link_label: "Ir a tu panel",
        link_url: "/dashboard",
    },
}

export default async function DeniedPage({ searchParams }: PageProps) {
	const resolvedSearchParams = await searchParams;
	const type = resolvedSearchParams.type as keyof typeof dataTypes;
	const session = await auth();

	const { title, message, link_label, link_url } = dataTypes[type] || {
		title: "Acceso Denegado",
		message: "No tienes los permisos necesarios.",
		link_label: "Volver a la página de inicio",
		link_url: "/",
	};

	return (
		<div className="flex flex-col items-center justify-center h-[80vh]">
			<h1 className="text-4xl font-bold mb-4 text-red-700">{title}</h1>
            <p className="text-lg mb-2">{message}</p>
            
            {/* Mostrar información del usuario actual */}
            {session?.user && (
                <div className="bg-gray-100 p-4 rounded-lg mb-4 text-center">
                    <p className="text-sm text-gray-600">Usuario actual:</p>
                    <p className="font-semibold">{session.user.email}</p>
                    <p className="text-sm">
                        Rol: <span className="font-medium capitalize text-blue-600">
                            {session.user.role || 'Sin rol asignado'}
                        </span>
                    </p>
                </div>
            )}
            
            <Link href={link_url} className="mt-4 text-blue-500 hover:underline">
                {link_label}
            </Link>
		</div>
	);
}