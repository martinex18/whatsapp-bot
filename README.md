# WhatsApp AI Bot

Chatbot de WhatsApp construido con **Next.js**, **Evolution API**, **OpenRouter** y **SQLite**.

El proyecto permite recibir mensajes de WhatsApp mediante Evolution API, procesarlos con un modelo gratuito de OpenRouter y enviar la respuesta nuevamente al usuario por WhatsApp.

Además, incluye un panel administrativo para configurar el comportamiento del bot.

## Tecnologías

- **Next.js 16** — frontend y backend en un mismo proyecto.
- **TypeScript** — tipado estático.
- **SQLite** — persistencia de la configuración del bot.
- **better-sqlite3** — conexión con SQLite.
- **Evolution API** — integración con WhatsApp.
- **Docker / Docker Compose** — ejecución de Evolution API y PostgreSQL.
- **OpenRouter** — proveedor del modelo de inteligencia artificial.
- **Tailwind CSS** — estilos del panel administrativo.

## Arquitectura

El proyecto utiliza una arquitectura monorepo, manteniendo frontend y backend dentro de la misma aplicación Next.js.

### Flujo

1. El usuario envía un mensaje por WhatsApp.
2. Evolution API recibe el mensaje.
3. Evolution API envía un webhook a `/api/webhook`.
4. Next.js obtiene la configuración almacenada en SQLite.
5. El mensaje y la configuración se envían a OpenRouter.
6. OpenRouter genera la respuesta.
7. Next.js envía la respuesta a Evolution API.
8. Evolution API envía la respuesta al usuario por WhatsApp.

## Estructura del proyecto

`data/bot.db` se genera localmente.

## Requisitos

Antes de comenzar se necesita:

- Node.js
- npm
- Docker Desktop
- Una cuenta gratuita de OpenRouter
- Una cuenta de WhatsApp para conectar mediante QR

## Instalación

Clona el repositorio:

```bash
git clone https://github.com/martinex18/whatsapp-bot
cd whatsapp-bot
```

Instala las dependencias:

```bash
npm install
```

## Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto.

Puedes utilizar `.env.example` como referencia.

## Levantar Evolution API

Evolution API utiliza Docker junto con PostgreSQL.

Ejecuta:

```bash
docker compose up -d
```

Comprueba que los contenedores estén ejecutándose:

```bash
docker compose ps
```

Evolution API estará disponible en:

```text
http://localhost:8080
```

## Crear la instancia de WhatsApp

Con Evolution API ejecutándose, crea una instancia utilizando el nombre:

```text
whatsapp-bot
```

La instancia utiliza la integración de WhatsApp mediante Baileys.

Despuésobtén el código QR y escanéalo desde WhatsApp en el teléfono para la prueba.

La instancia debe quedar conectada antes de realizar las pruebas del chatbot.

## Configurar el webhook

Como Evolution API se ejecuta dentro de Docker mientras Next.js se ejecuta directamente en el equipo local, el webhook utiliza:

```text
http://host.docker.internal:3000/api/webhook
```

Esta dirección permite que el contenedor de Docker acceda al servidor Next.js que se ejecuta en el host.

El webhook está configurado para recibir el evento:

```text
MESSAGES_UPSERT
```

## Ejecutar Next.js

En otra terminal:

```bash
npm run dev
```

El panel administrativo está disponible en:

```text
http://localhost:3000/admin
```

## Configurar el bot

Desde `/admin` puedes configurar:

- **Prompt:** instrucciones y personalidad del asistente.
- **Model:** modelo gratuito de OpenRouter.
- **Temperature:** controla el nivel de variación de las respuestas.

La configuración se almacena en SQLite.

El proyecto utiliza una única configuración global para el bot, por lo que no es necesario manejar múltiples registros de configuración.

## API

### `GET /api/health`

Endpoint para comprobar que el backend está funcionando.

### `GET /api/config`

Obtiene la configuración actual del bot.

### `POST /api/config`

Crea la configuración inicial del bot.

### `PUT /api/config`

Actualiza la configuración existente.

### `POST /api/webhook`

Recibe los mensajes enviados por Evolution API y ejecuta el flujo completo:

Los mensajes enviados por el propio bot se ignoran utilizando el campo `fromMe` para evitar que el bot responda a sus propios mensajes.

## Manejo de errores

Las integraciones externas con OpenRouter y Evolution API comprueban la respuesta HTTP mediante `response.ok`.

Cuando una petición falla:

- Se registra el error en la consola.
- Se lanza un error para detener el flujo.
- El webhook puede detectar el fallo en lugar de continuar con una respuesta inválida.

## Decisiones de arquitectura

### Next.js para frontend y backend

Se utilizó Next.js como monorepo porque la prueba solicita frontend y backend dentro del mismo proyecto.

Las API Routes permiten implementar los endpoints necesarios sin crear un servidor separado.

### SQLite

SQLite es suficiente para almacenar la configuración del bot durante esta prueba de concepto.

La tabla `bot_config` utiliza un identificador fijo:

```text
id = 1
```

Esto permite mantener una única configuración global.

### Evolution API en Docker

Evolution API se ejecuta mediante Docker Compose para facilitar la instalación y mantener aislada la integración con WhatsApp.

La imagen utilizada tiene una versión específica reduciendo el riesgo de cambios inesperados.

### OpenRouter

OpenRouter permite utilizar modelos gratuitos y cambiar el modelo desde el panel administrativo sin modificar el código.

## Validaciones y consideraciones

El proyecto está pensado como una prueba de concepto local y no como una aplicación productiva.

Actualmente:

- El panel administrativo no tiene autenticación.
- La configuración utiliza un único registro.
- El webhook maneja principalmente mensajes de texto.
- No existe memoria de conversaciones.
- No existe sistema RAG.
- No se implementó un sistema avanzado de colas o reintentos.
- No se realizó despliegue a producción.

## Qué mejoraría con más tiempo

En un entorno productivo agregaría:

- Autenticación y autorización para el panel administrativo.
- Validación más completa de los datos recibidos por el webhook.
- Manejo específico de diferentes tipos de mensajes de WhatsApp.
- Memoria e historial de conversaciones.
- Manejo avanzado de rate limits y disponibilidad de modelos.
- Sistema de reintentos e idempotencia para evitar mensajes duplicados.
- Tests automatizados.
- Gestión más segura de secretos y configuración de Docker.
- Deploy y monitoreo de la aplicación.

## Scripts

### Desarrollo

```bash
npm run dev
```

### Lint

```bash
npm run lint
```

### Build

```bash
npm run build
```

### Producción

```bash
npm run start
```

## Demo

La demostración del proyecto muestra:

1. Configuración del bot desde el panel administrativo.
2. Selección del modelo de OpenRouter.
3. Configuración del system prompt y temperature.
4. Envío de un mensaje desde WhatsApp.
5. Recepción del webhook mediante Evolution API.
6. Generación de la respuesta mediante OpenRouter.
7. Envío de la respuesta nuevamente a WhatsApp.
8. Modificación de la configuración y comprobación del nuevo comportamiento.
