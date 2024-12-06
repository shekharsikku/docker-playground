# Containerize React + Vite App on Docker

### Setup confiiguration for Docker in `Dockerfile`

#### Build the Docker Image

```bash
docker build -t react-docker .
```

#### Run the Docker Image

```bash
docker run react-docker
```

#### Port Mapping for run Docker Image on Host Machine

```bash
docker run -p 5173:5173 react-docker
```

#### Mount `cwd` to `app` dir inside the container

```bash
docker run -p 5173:5173 -v "$(pwd):/app" -v /app/node_modules react-docker
```

#### Compose using `compose.yaml` file

```bash
docker-compose up
```

---
