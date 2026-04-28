# Guia de Estilo de Programacion Back-end

Esta guia define como debe escribirse el codigo del back-end de FutStats. La intencion es que todos los modulos de Nest.js parezcan construidos por el mismo equipo, aunque cada integrante trabaje en una parte distinta.

## Herramientas de Formato y Calidad

El back-end debe usar Prettier y ESLint como controles obligatorios de estilo.

### Prettier

Prettier se encarga del formato automatico del codigo. No decide arquitectura, pero evita discusiones sobre espacios, saltos de linea, comillas o punto y coma.

Uso recomendado:

```bash
cd backend
npm run format
```

### ESLint

ESLint revisa problemas de TypeScript, imports, codigo sin uso y practicas que pueden producir errores en Nest.js.

Uso recomendado:

```bash
cd backend
npm run lint
```

## Cuando Ejecutarlos

- Antes de subir cambios al repositorio.
- Antes de abrir un pull request o entregar una version.
- Despues de crear o modificar modulos, servicios, controladores, DTOs o entidades.
- Antes de fusionar cambios de varios integrantes.

## Ubicacion de Trabajo

Todos los comandos del back-end se ejecutan desde la carpeta:

```bash
backend/
```

El back-end no debe depender de archivos internos del front-end. La comunicacion entre ambos proyectos ocurre mediante HTTP y contratos de API.

## Convenciones de Codigo

### TypeScript

- Todo metodo publico debe declarar tipos de parametros y retorno.
- No se permite `any`.
- Usar `unknown` cuando el tipo aun no esta validado.
- Preferir tipos, DTOs e interfaces claras sobre objetos genericos.
- Evitar funciones demasiado largas; si una validacion se repite, moverla a un metodo privado del servicio.

### Nombres

- Modulos: plural por dominio, por ejemplo `teams`, `players`, `matches`.
- Entidades: singular y con sufijo `Entity`, por ejemplo `TeamEntity`.
- DTOs: accion + dominio + `Dto`, por ejemplo `CreatePlayerDto`.
- Servicios: dominio + `Service`, por ejemplo `MatchesService`.
- Controladores: dominio + `Controller`, por ejemplo `TeamsController`.
- Guards y strategies: nombre de responsabilidad + tipo, por ejemplo `JwtAuthGuard`.

### Imports

Cada archivo con imports debe separar los bloques con comentarios y una linea en blanco para que el codigo respire. Este formato es obligatorio en controladores, servicios, modulos, DTOs, entidades, guards, strategies y archivos de configuracion.

Formato obligatorio:

1. Imports externos.
2. Imports internos absolutos o relativos del modulo.
3. Imports de tipos, cuando aplique.

Reglas:

- Usar el comentario `// 1. External imports` antes de dependencias externas.
- Dejar una linea en blanco entre los imports externos y el siguiente comentario.
- Usar el comentario `// 2. Internal imports` antes de imports del proyecto.
- Ordenar alfabeticamente los imports dentro de cada bloque.
- Mantener separados los imports de tipos con `import type` cuando solo se usen como tipos.
- Eliminar imports sin uso antes de entregar.

Ejemplo:

```typescript
// 1. External imports
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// 2. Internal imports
import { CreateTeamDto } from './dto/create-team.dto';
import type { TeamEntity } from './entities/team.entity';
import { TeamsService } from './teams.service';
```

## Estilo por Capa

### Controllers

Los controladores solo reciben la peticion, extraen parametros y delegan al servicio.

Correcto:

```typescript
@Get(':id')
findOne(@Param('id') id: string): Promise<TeamEntity> {
  return this.teamsService.findOne(Number(id));
}
```

Evitar:

- Consultar repositorios directamente.
- Calcular estadisticas complejas.
- Armar respuestas manuales de error.
- Duplicar validaciones que ya pertenecen al servicio.

### Services

Los servicios contienen la logica del dominio de FutStats.

Responsabilidades:

- Validar existencia de equipos, jugadores y partidos.
- Coordinar repositorios o modelos de persistencia.
- Aplicar reglas de negocio.
- Lanzar excepciones de Nest.js cuando algo no cumple una regla.
- Encapsular operaciones repetidas en metodos privados.

### DTOs

Los DTOs representan contratos de entrada.

Reglas:

- No usar entidades como cuerpo de peticion.
- Validar campos con `class-validator`.
- Separar DTOs de creacion y actualizacion.
- No incluir campos generados por base de datos como `id`, `createdAt` o `updatedAt`.

### Entities

Las entidades representan la base de datos.

Reglas:

- Definir relaciones de forma explicita.
- Usar nombres consistentes con el dominio: `homeTeam`, `awayTeam`, `team`, `players`.
- Evitar mezclar calculos de negocio dentro de la entidad.
- Mantener fechas de auditoria cuando el proyecto lo permita.

## Variables de Entorno

La configuracion debe vivir en `.env`, con ejemplo minimo en `.env.example`.

Variables recomendadas:

```env
PORT=3000
API_PREFIX=api
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=change-me
JWT_EXPIRES_IN=1d
DATABASE_URL=file:./futstats.db
```

Nunca se deben hardcodear secretos, rutas de base de datos productivas ni credenciales.

## Checklist de Calidad

Antes de entregar codigo del back-end:

```bash
cd backend
npm run format
npm run lint
npm run test
```

Si alguna validacion falla, se corrige antes de subir el cambio. La regla del proyecto es simple: codigo que no pasa controles locales no esta listo para revision.
