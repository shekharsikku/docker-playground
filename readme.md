# Docker Playground

## 📦 Node.js Docker App

This is a basic Node.js application bundled with Docker for seamless development and deployment.

---

### 📁 Project Structure

```
.
├── Dockerfile
├── .dockerignore
├── package.json
├── package-lock.json
├── src/
│   └── index.js
└── README.md
```

---

### 🚀 Getting Started

#### Prerequisites

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)

---

### 🛠️ Development

To run the app locally (without Docker):

```bash
npm install
npm run start
```

---

### 🐳 Docker Usage

#### Build Docker Image

```bash
docker build -t node-docker-app .
```

#### Run Docker Container

```bash
docker run -p 3000:3000 node-docker-app
```

> Visit http://localhost:3000 to see your app running.

---

### 🧾 Dockerfile Example

```Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

---

### 📄 .dockerignore Example

```
node_modules
npm-debug.log
Dockerfile
.dockerignore
```

---

### 📞 API Endpoints (Example)

| Method | Endpoint     | Description     |
|--------|--------------|-----------------|
| GET    | `/`          | Welcome route   |

---

### 📚 License

This project is licensed under the MIT License.

---

Docs by [shekharsikku](https://linkedin.com/in/shekharsikku)
