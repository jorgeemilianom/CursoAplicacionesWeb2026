# Instalacion de Docker

## Requisitos previos

- Windows 10/11 de 64 bits (Build 19041 o superior)
- Virtualizacion habilitada en la BIOS
- WSL 2 instalado (para Windows)

---

## 1. Instalar Docker Desktop en Windows

1. Descarga el instalador desde la pagina oficial de Docker:
   [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

2. Ejecuta el instalador `Docker Desktop Installer.exe`.

3. Durante la instalacion, asegurate de marcar la opcion **"Use WSL 2 instead of Hyper-V"**.

4. Una vez instalado, reinicia el equipo si se te solicita.

5. Abre **Docker Desktop** desde el menu de inicio y espera a que el motor de Docker arranque (el icono de la ballena en la barra de tareas debe estar en verde).

---

## 2. Verificar la instalacion

Abre una terminal (PowerShell, CMD o Git Bash) y ejecuta:

```bash
docker --version
docker compose version
```

Deberias ver algo como:

```
Docker version 27.x.x, build ...
Docker Compose version v2.x.x
```

---

## 3. Instalar WSL 2 (si no lo tienes)

En PowerShell como administrador:

```powershell
wsl --install
```

Reinicia el equipo y configura tu usuario de Linux cuando se abra la terminal de Ubuntu.

Para verificar:

```powershell
wsl --list --verbose
```

---

## Recursos adicionales

- Documentacion oficial de Docker: [https://docs.docker.com](https://docs.docker.com)
- Guia de WSL 2: [https://learn.microsoft.com/es-es/windows/wsl/install](https://learn.microsoft.com/es-es/windows/wsl/install)
