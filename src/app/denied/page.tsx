import Link from "next/link";

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
}

export default async function DeniedPage({ searchParams }: PageProps) {
	const resolvedSearchParams = await searchParams;
	const type = resolvedSearchParams.type;

	const { title, message, link_label, link_url } = dataTypes[type] || {
		title: "Acceso Denegado",
		message: "No tienes los permisos necesarios.",
		link_label: "Volver a la página de inicio",
		link_url: "/",
	};

	return (
		<div className="flex flex-col items-center justify-center h-[80vh]">
			<h1 className="text-4xl font-bold mb-4 text-red-700">{title}</h1>
            <p className="text-lg">{message}</p>
            <Link href={link_url} className="mt-4 text-blue-500 hover:underline">
                {link_label}
            </Link>
		</div>
	);
}