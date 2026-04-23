# Ollama con Docker Compose

Este proyecto incluye un `docker-compose.yml` que levanta dos servicios:

| Servicio      | Descripcion                        | Puerto         |
|---------------|------------------------------------|----------------|
| `ollama`      | Motor de modelos LLM local         | `11434`        |
| `open-webui`  | Interfaz web para chatear con LLMs | `3000` → `8080`|

---

## Requisitos

- Docker Desktop instalado y corriendo (ver [docker-instalacion.md](./docker-instalacion.md))
- El archivo `docker-compose.yml` en la raiz del proyecto

---

## Levantar los servicios

Desde la raiz del proyecto, ejecuta:

```bash
docker compose up -d
```

La flag `-d` corre los contenedores en segundo plano (detached mode).

La primera vez Docker descargara las imagenes automaticamente. Puede tardar varios minutos dependiendo de tu conexion.

---

## Acceder a los servicios

Una vez levantados los contenedores:

- **Open WebUI** (interfaz de chat): [http://localhost:3000](http://localhost:3000)
- **API de Ollama** (directa): [http://localhost:11434](http://localhost:11434)

---

## Descargar un modelo en Ollama

Los modelos no vienen incluidos. Debes descargarlos dentro del contenedor.

### Opcion 1 — Desde la terminal del contenedor

```bash
docker exec -it ollama ollama pull llama3
```

Otros modelos disponibles: `mistral`, `phi3`, `gemma`, `codellama`, etc.

### Opcion 2 — Desde Open WebUI

Entra a [http://localhost:3000](http://localhost:3000), crea una cuenta de administrador y ve a **Settings > Models** para descargar modelos desde la interfaz.

---

## Comandos utiles

```bash
# Ver el estado de los contenedores
docker compose ps

# Ver los logs en tiempo real
docker compose logs -f

# Ver logs solo de ollama
docker compose logs -f ollama

# Detener los servicios
docker compose down

# Detener y eliminar volumenes (borra los modelos descargados)
docker compose down -v

# Reiniciar un servicio especifico
docker compose restart ollama
```

---

## Persistencia de datos

Los datos se guardan en volumenes de Docker para que no se pierdan al reiniciar:

- `ollama_data` — modelos descargados en Ollama
- `open_webui_data` — historial de chats y configuracion de Open WebUI

---

## Estructura del docker-compose.yml

```yaml
services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    restart: unless-stopped

  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: open-webui
    ports:
      - "3000:8080"
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
    volumes:
      - open_webui_data:/app/backend/data
    depends_on:
      - ollama
    restart: unless-stopped
```
