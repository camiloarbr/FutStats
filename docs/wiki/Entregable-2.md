# Entregable 2

Esta pagina resume los avances tecnicos de FutStats para el segundo entregable. El objetivo principal es dejar de depender de datos quemados en el front-end y mover la informacion del dominio futbolistico a un back-end construido con Nest.js.

## 1. Front-end Vue.js conectado al Back-end

El front-end conserva la base construida en Vue 3, TypeScript, Vite, Pinia, Vue Router, TailwindCSS, Chart.js y Leaflet. La diferencia clave para este entregable es que los datos de equipos, jugadores, partidos y usuarios ya no deben nacer desde seeders ni desde LocalStorage como fuente principal.

### Ajustes esperados

- Eliminar los seeders del flujo normal de la aplicacion.
- Mantener Pinia solo para estado de interfaz, sesion y cache temporal cuando sea necesario.
- Mover las operaciones de lectura y escritura hacia servicios que consuman la API del back-end.
- Conservar las vistas y componentes como capas de presentacion: no deben conocer detalles de base de datos ni autenticacion interna.
- Manejar estados de carga, error y respuesta vacia en tablas, formularios y vistas de detalle.
- Usar DTOs tipados para crear y actualizar equipos, jugadores y partidos.
- Proteger las rutas administrativas mediante el estado real de autenticacion recibido desde el back-end.

### Dominios principales

- Teams: informacion general del equipo, estadisticas de temporada y resultados agregados.
- Players: datos personales, posicion, dorsal, equipo asociado y rendimiento.
- Matches: fecha, estadio, marcador, posesion, tiros, faltas y relacion con equipos local/visitante.
- Auth/Users: inicio de sesion, rol del usuario y control de acceso.

## 2. Back-end Nest.js y base de datos

El back-end se agrega al repositorio como una carpeta independiente llamada `backend/`. Este proyecto expone una API REST para que el front-end pueda consultar y modificar la informacion de FutStats.

### Modulos propuestos

- `auth`: login, validacion de credenciales, generacion de token y proteccion de rutas.
- `users`: administracion de usuarios y roles.
- `teams`: CRUD de equipos y reglas de estadisticas de equipo.
- `players`: CRUD de jugadores y validacion de relacion con equipos.
- `matches`: CRUD de partidos y validacion de equipos local/visitante.

### Responsabilidades del Back-end

- Persistir los datos en una base de datos real.
- Validar entradas con DTOs y pipes de Nest.js.
- Mantener la logica de negocio en servicios.
- Devolver errores usando excepciones propias del framework.
- Proteger endpoints privados con guards de autenticacion.
- Separar configuracion sensible mediante variables de entorno.
- Definir CORS de forma explicita para permitir el consumo desde el front-end.

### Formato de imports

El back-end debe mantener imports ordenados y legibles en todos sus archivos TypeScript. El formato definido para FutStats es:

```typescript
// 1. External imports
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// 2. Internal imports
import type { TeamEntity } from './entities/team.entity';
import { TeamsService } from './teams.service';
```

Reglas del formato:

- Primero van las dependencias externas.
- Luego va una linea en blanco.
- Despues van los imports internos del proyecto.
- Cada bloque debe estar ordenado alfabeticamente.
- Los imports usados solo como tipos deben escribirse con `import type`.

### Flujo general

1. El usuario inicia sesion desde Vue.
2. El front-end envia credenciales al modulo `auth`.
3. Nest.js valida el usuario y responde con un token y los datos publicos de sesion.
4. El front-end guarda el token de forma controlada y lo adjunta en las peticiones protegidas.
5. Los servicios del front-end consultan endpoints como `/api/teams`, `/api/players` y `/api/matches`.
6. El back-end valida permisos, ejecuta reglas de negocio y persiste cambios en la base de datos.

## Criterios de Revision Interna

Antes de entregar, el equipo debe revisar:

- `npm run lint` y `npm run format` en `frontend/`.
- `npm run lint` y `npm run format` en `backend/`.
- Login funcional con usuario valido e invalido.
- Rutas protegidas inaccesibles sin token.
- CRUD funcional para los dominios principales.
- Seeders y datos quemados removidos del flujo productivo del front-end.
- Variables de entorno documentadas en `.env.example`.
- Wiki actualizada con guia de estilo y reglas del back-end.
