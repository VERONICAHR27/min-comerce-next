# Min Commerce Next.js

## Para empezar

Primero, ejecute el servidor de desarrollo:

```bash
npm run dev

Abrir [http://localhost:3000](http://localhost:3000) con su navegador para ver el resultado.

# Sistema de Autenticación y Autorización

## Características Principales

### **Autenticación**
- **NextAuth.js** con soporte para Google OAuth
- **Gestión de sesiones** JWT y base de datos
- **Middleware de protección** de rutas automático
- **Páginas personalizadas** de login y error

### **Autorización por Roles**
- **Roles de usuario**: `admin` y `user`
- **Protección de rutas** basada en roles
- **Acceso granular** a funcionalidades

### **Tracking de Actividad**
- **Registro automático** de eventos de login/logout
- **Dashboard de logs** para administradores
- **Estadísticas en tiempo real** de actividad de usuarios

## Middleware de Protección

### **Rutas Protegidas**

| Ruta | Sin Sesión | Usuario `user` | Usuario `admin` |
|------|------------|----------------|-----------------|
| `/admin/*` | ❌ → `/denied` | ❌ → `/denied` | ✅ Acceso permitido |
| `/profile/*` | ❌ → `/denied` | ✅ Acceso permitido | ✅ Acceso permitido |
| `/dashboard/*` | ❌ → `/denied` | ✅ Acceso permitido | ✅ Acceso permitido |

## 📊 Dashboard de Logs (Solo Admin)

### **Métricas Disponibles**
- 🟣 **Usuarios Hoy**: Usuarios únicos que se conectaron hoy
- 🟢 **Logins Hoy**: Inicios de sesión del día actual
- 🔵 **Logins Ayer**: Inicios de sesión del día anterior  
- 🔴 **Logouts Hoy**: Cierres de sesión del día actual
- ⚫ **Logouts Ayer**: Cierres de sesión del día anterior

## Uso

### **Acceso como Usuario Regular**
1. Ir a `/login`
2. Iniciar sesión con Google
3. Acceso a `/profile` y `/dashboard`
4. **Restringido**: No puede acceder a `/admin/*`

### **Acceso como Administrador**
1. Acceso completo a todas las rutas
2 **Dashboard de logs** disponible en `/admin/logs`
