# DinalPets S.A.S. - Plataforma Web Full-Stack

Aplicación web de comercio electrónico y gestión de catálogo para **DinalPets S.A.S.**, contenerizada y orquestada mediante **Docker Compose**.

## Tecnologías Utilizadas
* **Frontend:** Angular (Puerto `4200`)
* **Backend:** ASP.NET Core Web API - .NET 8 (Puerto `8080`)
* **Base de Datos:** Microsoft SQL Server 2022 con Entity Framework Core y migraciones automáticas (Puerto `1433`)
* **Infraestructura:** Docker & Docker Compose con volumen persistente (`sqlserver_data`)

## Requisitos Previos
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución.

## Ejecución del Proyecto
1. Clonar el repositorio y abrir una terminal en la carpeta raíz donde se encuentra `docker-compose.yml`.
2. Construir y levantar los contenedores con el siguiente comando:
   ```bash
   docker compose up --build
   ```
3. Esperar a que los tres servicios (`dinalpets-sqlserver`, `dinalpets-backend` y `dinalpets-frontend`) estén en estado **Running**.

## Accesos y Credenciales
* **Tienda Web (Frontend):** `http://localhost:4200`
* **Documentación API (Swagger):** `http://localhost:8080/swagger`
* **Acceso Administrador (Admin Login):**
  * **Usuario:** `admin`
  * **Contraseña:** `admin123`