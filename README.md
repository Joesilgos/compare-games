# API de Games com NestJS

## 🛠️ Pré-requisitos

*   [Docker](https://docs.docker.com/get-docker/)
*   [Docker Compose](https://docs.docker.com/compose/install/)
*   [Node.js](https://nodejs.org/) (opcional, apenas para desenvolvimento local sem Docker)
*   [Git](https://git-scm.com/)

## ⚙️ Instalação e Configuração

1.  **Clone o repositório:**
    ```bash
    git clone <url-do-repositorio>
    cd <diretorio-do-projeto>
    ```

2.  **Crie o arquivo de variáveis de ambiente:**
    Copie o arquivo de exemplo `.env.example` para `.env`:
    ```bash
    cp .env.example .env
    ```

3.  **Configure as variáveis de ambiente:**
    Edite o arquivo `.env` e preencha com seus valores, **principalmente a `RAWG_API_KEY`**:
    ```dotenv
    # Porta da aplicação NestJS
    PORT=3000

    # Chave da API RAWG (obtenha em https://rawg.io/apidocs)
    RAWG_API_KEY=SUA_CHAVE_API_RAWG_AQUI

    # Configurações do Banco de Dados PostgreSQL (usado pelo docker-compose)
    DB_HOST=db
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=postgres
    DB_DATABASE=games_db

    # Configurações do Cache Redis (usado pelo docker-compose)
    REDIS_HOST=cache
    REDIS_PORT=6379
    CACHE_TTL=600 # Tempo de vida do cache em segundos (padrão: 10 minutos)
    ```

## ▶️ Executando a Aplicação (com Docker Compose - Recomendado)

1.  **Construa e inicie os contêineres:**
    No diretório raiz do projeto, execute:
    ```bash
    docker compose up --build -d
    ```
    *   `--build`: Força a reconstrução da imagem da aplicação se houver alterações no código ou Dockerfile.
    *   `-d`: Executa os contêineres em segundo plano (detached mode).

2.  **Acesse a API:**
    *   A API estará disponível em: `http://localhost:3000` (ou a porta definida em `PORT` no `.env`).
    *   A documentação Swagger estará disponível em: `http://localhost:3000/api-docs`.

3.  **Parando a Aplicação:**
    ```bash
    docker compose down
    ```
    *   Para remover os volumes (dados do banco) também, use `docker compose down -v`.

## 💻 Executando Localmente (Sem Docker - Funcionalidade Limitada)

**Atenção:** Esta forma de execução **não** iniciará o banco de dados PostgreSQL nem o cache Redis. Funcionalidades que dependem deles (persistência, cache, listagem do banco) **não funcionarão corretamente**.

1.  **Instale as dependências:**
    ```bash
    npm install
    ```

2.  **Instale as dependências do Playwright (se ainda não instaladas globalmente):**
    ```bash
    npx playwright install --with-deps
    ```

3.  **Inicie a aplicação em modo de desenvolvimento:**
    ```bash
    npm run start:dev
    ```

## 📖 Endpoints da API

A documentação completa e interativa está disponível via Swagger em `/docs` quando a aplicação está em execução.




