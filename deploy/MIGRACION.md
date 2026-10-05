# Caddy y DuckDNS comunes en la Raspberry Pi

Hoy el Caddy y el DuckDNS viven dentro del proyecto `lista-compra-nfc`. Se mueven a `~/homelab/infra` para que sirvan
a todas las webs (la lista de la compra y Andiamo, y las que vengan). Cada web solo declara su bloque en el `Caddyfile`.

```
~/homelab/
├── infra/               ← Caddy + DuckDNS (red "edge")        ← nuevo
├── lista-compra-nfc/    ← solo PocketBase
└── andiamo-tour/        ← la web (git clone de este repo)
```

Archivos listos para copiar, en este repo:

| En este repo                                | Destino en la Pi                                        |
| ------------------------------------------- | ------------------------------------------------------- |
| `deploy/infra/*` (incluido `.env.example`)  | `~/homelab/infra/`                                      |
| `deploy/lista-compra-nfc/docker-compose.yml`| `~/homelab/lista-compra-nfc/docker-compose.yml`         |
| `docker-compose.yml` (raíz)                 | ya está en la raíz del proyecto, al clonarlo            |

## Antes de empezar (5 minutos, no se salta)

1. Crea en <https://www.duckdns.org> el subdominio nuevo para Andiamo (por ejemplo `andiamo-roma`).
2. Copia de seguridad de la lista de la compra y del certificado:

   ```bash
   cd ~/homelab
   sudo tar czf ~/copia-lista-compra-$(date +%F).tgz lista-compra-nfc          # incluye pb_data y .env
   docker volume ls | grep caddy                                                # deben salir lista-compra-nfc_caddy_data y _caddy_config
   docker run --rm -v lista-compra-nfc_caddy_data:/data -v ~:/copia alpine tar czf /copia/caddy_data-$(date +%F).tgz -C /data .
   cp lista-compra-nfc/docker-compose.yml lista-compra-nfc/docker-compose.yml.bak
   ```

   Si los volúmenes no se llaman así, corrige los dos nombres `name:` de `deploy/infra/docker-compose.yml`.
3. Clona Andiamo: `git clone <repo> ~/homelab/andiamo-tour`.
4. Prepara `infra` (todavía sin arrancar nada):

   ```bash
   mkdir -p ~/homelab/infra && cd ~/homelab/infra
   # copia aquí docker-compose.yml, Caddyfile, Dockerfile.caddy y .env.example de deploy/infra/
   cp .env.example .env
   grep -E '^(DUCKDNS_API_TOKEN|ADMIN_USER|ADMIN_PASSWORD_HASH)=' ../lista-compra-nfc/.env >> .env
   nano .env      # borra las tres líneas vacías de arriba (las del ejemplo) y rellena ANDIAMO_DOMAIN y ANDIAMO_SUBDOMAIN
   ```

5. Construye ya el Caddy (tarda unos minutos en la Pi y así no alarga el corte):

   ```bash
   cd ~/homelab/infra && docker compose build
   ```

## Migración (la web de la compra estará unos minutos sin servicio)

```bash
# 1. Parar el Caddy y el DuckDNS antiguos (PocketBase sigue funcionando por la red local)
cd ~/homelab/lista-compra-nfc
docker compose stop caddy duckdns

# 2. Arrancar la infraestructura común (crea la red "edge")
cd ~/homelab/infra
docker compose up -d

# 3. Pasar la lista de la compra al compose nuevo (quita el Caddy y el DuckDNS viejos y pone PocketBase en "edge")
cd ~/homelab/lista-compra-nfc
cp ~/homelab/andiamo-tour/deploy/lista-compra-nfc/docker-compose.yml docker-compose.yml
docker compose up -d --remove-orphans

# 4. Arrancar Andiamo
cd ~/homelab/andiamo-tour
docker compose up -d --build
```

## Comprobar

```bash
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Networks}}'    # caddy, duckdns, andiamo y pocketbase, todos "Up"
docker logs caddy --tail 40                                           # sin errores de certificado
```

- `https://despensa4b.duckdns.org` debe abrir como siempre (y `/_/` seguir pidiendo usuario y contraseña).
- `https://<tu-subdominio-de-andiamo>.duckdns.org` debe abrir Andiamo.
- El primer acceso a Andiamo puede tardar unos segundos mientras Caddy consigue su certificado.

## Marcha atrás (si la web de la compra no vuelve)

```bash
cd ~/homelab/infra && docker compose down
cd ~/homelab/lista-compra-nfc
cp docker-compose.yml.bak docker-compose.yml
docker compose up -d
```

Con eso queda todo como antes. El certificado no se toca en ningún momento: el volumen se reutiliza, no se copia ni se borra.

## Actualizar Andiamo desde ahora

```bash
cd ~/homelab/andiamo-tour && git pull && docker compose up -d --build
```

## Añadir otra web más

1. Un subdominio nuevo en DuckDNS y sus dos variables en `infra/.env`; añade `${NUEVO_SUBDOMAIN}` a `SUBDOMAINS`.
2. Un bloque en `infra/Caddyfile` (copia el de Andiamo).
3. Su `docker-compose.yml` con la red `edge` y un alias único.
4. `docker exec caddy caddy reload --config /etc/caddy/Caddyfile` y `docker compose up -d` en `infra`.
