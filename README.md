### 🛡️ Seguridad e Infraestructura
* **Aislamiento de Red:** La aplicación Node.js (`devops-app`) se encuentra expuesta internamente (`3000/tcp`) dentro de una red privada de Docker, forzando a que todo el tráfico pase únicamente a través de **Nginx** como Reverse Proxy en el puerto `80`.
* **Inmutabilidad y Versionado:** Todas las imágenes (`nginx`, `prometheus`, `grafana`, `node-exporter`) utilizan etiquetas de versiones fijas y estables (sin el uso de `:latest`), asegurando despliegues deterministas y reproducibles.
* **Gestión Segura de Secretos:** Parámetros sensibles e información de producción aislados fuera del control de versiones mediante variables de entorno (`.env`) y plantillas (`.env.example`).
* **Protección de Almacenamiento:** Rotación automática y límites de almacenamiento en logs de Docker (`max-size: 10m`, `max-file: 3`) para prevenir la saturación de disco en la instancia EC2.

### 🔄 Pipeline de CI/CD (GitHub Actions)
* **Shift Left & Fail Fast:** Análisis estático de código, detección de fuga de secretos (**Gitleaks**) y auditoría de vulnerabilidades en dependencias (`npm audit`) en las primeras etapas del pipeline.
* **Caché de Capas:** Optimización del tiempo de compilación de las imágenes mediante caché nativa de GitHub Actions (`type=gha`).
* **Análisis de Vulnerabilidades en Contenedores:** Escaneo automatizado de vulnerabilidades en tiempo de compilación con **Trivy**.
* **Despliegue Resiliente y Validado:** Scripts de despliegue mediante SSH a AWS EC2 con **Health Check activo** (`docker inspect`) para confirmar la estabilidad de los servicios antes de concluir la ejecución.
* **Notificaciones:** Integración con Telegram para alertar el estado final de los despliegues con autor, commit hash y metadata.
