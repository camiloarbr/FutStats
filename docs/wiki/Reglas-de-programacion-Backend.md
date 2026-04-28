# Reglas de Programacion Back-end

Estas reglas son obligatorias para el back-end de FutStats. Su proposito es proteger la arquitectura del proyecto y evitar que el codigo crezca de forma desordenada.

## Reglas Generales

- El back-end vive dentro de `backend/`.
- El prefijo global de la API debe mantenerse como `/api`.
- Cada dominio debe tener su propio modulo.
- Todo codigo nuevo debe pasar formato, lint y pruebas disponibles.
- No se permite `any`, ni explicito ni implicito.
- No se deben dejar `console.log` de depuracion en codigo final.
- No se deben hardcodear credenciales, tokens, usuarios o rutas de base de datos.

## Imports

- Todo archivo con imports debe usar comentarios de bloque.
- El primer bloque debe iniciar con `// 1. External imports`.
- El segundo bloque debe iniciar con `// 2. Internal imports`.
- Debe existir una linea en blanco entre bloques.
- Los imports deben estar en orden alfabetico dentro de cada bloque.
- Los imports que solo se usan como tipos deben declararse con `import type`.
- No se permiten imports sin uso.

Ejemplo obligatorio:

```typescript
// 1. External imports
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// 2. Internal imports
import type { PlayerEntity } from './entities/player.entity';
import { PlayersService } from './players.service';
```

## Arquitectura

- Organizar el codigo por dominio: `auth`, `users`, `teams`, `players`, `matches`.
- Cada dominio debe incluir modulo, controller, service, DTOs y entidad/modelo cuando aplique.
- `AppModule` solo debe componer modulos y configuracion global.
- Ningun modulo debe quedar creado pero sin registrar.
- La comunicacion con el front-end se realiza por endpoints REST, no compartiendo archivos internos entre proyectos.

## Controllers

- Un controller no contiene reglas de negocio.
- Un controller no accede directamente a la base de datos.
- Las rutas deben ser descriptivas y RESTful.
- Usar `GET`, `POST`, `PATCH` y `DELETE` segun la accion real.
- Evitar rutas con verbos en el nombre como `/getTeams` o `/createPlayerNow`.
- Las rutas protegidas deben declarar guards en el controller o en el metodo.

## Services

- Toda regla del dominio debe vivir en el service.
- Antes de actualizar o eliminar, se debe validar que el recurso exista.
- Antes de crear un jugador, se debe validar que el equipo asociado exista.
- Antes de crear un partido, se debe validar que local y visitante existan y no sean el mismo equipo.
- Las estadisticas derivadas deben calcularse en un lugar unico para evitar diferencias entre vistas.
- La coordinacion entre varias entidades debe resolverse en services, no en controllers.

## DTOs y Validacion

- Todo body de entrada debe tener DTO.
- Los DTOs deben usar validadores como `IsString`, `IsNumber`, `IsEmail`, `IsEnum`, `IsOptional` o equivalentes.
- Los DTOs de actualizacion deben permitir campos opcionales, pero no campos desconocidos.
- No se reciben entidades completas desde el cliente.
- Los ids recibidos por parametro deben convertirse y validarse antes de usarse.
- El back-end no debe confiar en que el front-end ya valido los datos.

## Persistencia

- La base de datos es la fuente de verdad.
- El front-end no debe depender de seeders para mostrar informacion real.
- Las relaciones deben estar modeladas con claridad: jugador-equipo y partido-equipos.
- No se debe borrar informacion relacionada sin revisar impacto en otros dominios.
- Evitar `synchronize: true` en ambientes de entrega o produccion si se usan migraciones.
- Las consultas repetidas deben encapsularse en metodos del servicio o repositorio.

## Autenticacion y Autorizacion

- La autenticacion pertenece al modulo `auth`.
- Las contrasenas no se guardan en texto plano.
- El login debe responder con token y datos publicos del usuario, nunca con password hash.
- Los tokens se validan con guards.
- Las rutas administrativas solo deben permitir usuarios con rol autorizado.
- La informacion de usuario validada debe adjuntarse al request mediante el guard o strategy.
- No duplicar logica de autenticacion dentro de `teams`, `players` o `matches`.

## Manejo de Errores

- Usar excepciones de Nest.js: `NotFoundException`, `BadRequestException`, `ConflictException`, `UnauthorizedException` y `ForbiddenException`.
- No devolver errores manuales con objetos sueltos como `{ error: true }`.
- Los mensajes deben explicar el problema sin exponer datos sensibles.
- Fallar rapido cuando una relacion no existe.
- No ocultar errores de validacion con mensajes genericos.

## Contratos con el Front-end

- Mantener respuestas en `camelCase`.
- Documentar cambios de endpoints antes de modificar servicios del front-end.
- No cambiar nombres de campos usados por Vue sin actualizar DTOs e interfaces.
- Las fechas deben viajar en formato serializable y consistente.
- El front-end no debe calcular reglas que pertenecen al negocio del back-end.

## Calidad de Codigo

- Ejecutar `npm run format` antes de entregar.
- Ejecutar `npm run lint` antes de entregar.
- Ejecutar pruebas unitarias o de integracion cuando existan.
- El codigo duplicado en tres lugares debe extraerse.
- Las funciones privadas deben tener nombres que expliquen la regla que encapsulan.
- Cada cambio debe ser pequeño, revisable y conectado con una necesidad del dominio.

## Antipatrones Prohibidos

- Logica de negocio en controllers.
- Entidades usadas como DTOs de entrada.
- Passwords en texto plano.
- Rutas con nombres verbales o improvisados.
- Imports sin usar.
- Modulos creados y no registrados.
- Validaciones solo en el front-end.
- Respuestas de error armadas manualmente.
- Seeders como fuente principal de datos de la aplicacion.
