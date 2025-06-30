This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Para empezar

Primero, ejecute el servidor de desarrollo:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## Sistema de Autenticación y Autorización

### Rutas Protegidas

El middleware implementa un sistema de protección condicional basado en roles para las siguientes rutas:

| Ruta | Roles Permitidos | Descripción |
|------|------------------|-------------|
| `/admin/*` | `admin` | Rutas exclusivas para administradores |
| `/dashboard/*` | `admin`, `user` | Panel accesible para usuarios autenticados |
| `/profile/*` | `admin`, `user` | Gestión de perfil para usuarios autenticados |

### Comportamiento del Middleware

#### Sin Sesión
- **Redirección**: `/denied?type=no_session`
- **Acción**: Mostrar mensaje para iniciar sesión

#### Usuario con rol `user`
- **Acceso permitido**: `/dashboard/*`, `/profile/*`
- **Acceso denegado**: `/admin/*` → Redirige a `/dashboard`

#### Usuario con rol `admin`
- **Acceso permitido**: Todas las rutas protegidas
- **Privilegios completos**: `/admin/*`, `/dashboard/*`, `/profile/*`

#### Usuario sin rol o rol desconocido
- **Redirección**: `/denied?type=insufficient_permissions`
- **Acción**: Mostrar mensaje de permisos insuficientes

