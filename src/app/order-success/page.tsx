import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="text-center space-y-6 p-8">
                <div className="flex justify-center">
                    <CheckCircle className="w-20 h-20 text-green-500" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">¡Gracias por tu pedido!</h1>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                    Tu pedido ha sido procesado exitosamente. Te enviaremos un correo electrónico con los detalles de tu compra.
                </p>
                <div className="pt-6">
                    <Link
                        href="/"
                        className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Volver al Inicio
                    </Link>
                </div>
            </div>
        </div>
    );
}
