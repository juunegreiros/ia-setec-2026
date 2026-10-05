# Sistema de pedidos — comandos do repositório (rodar sempre na raiz)
# Sem make (Windows)? O README lista o comando equivalente de cada alvo.
ROOT_DIR := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))
API_DIR := $(ROOT_DIR)/apps/api
WEB_DIR := $(ROOT_DIR)/apps/web
VENV := $(API_DIR)/.venv

# Prefere o Python mais novo instalado: no macOS, `python3` costuma ser o 3.9 do sistema.
# Para forçar um específico: make setup PYTHON_BIN=/caminho/para/python3.13
ifeq ($(OS),Windows_NT)
  PYTHON_BIN ?= python
  VENV_BIN := $(VENV)/Scripts
else
  PYTHON_BIN ?= $(shell for p in python3.14 python3.13 python3.12 python3.11 python3.10 python3; do \
    command -v $$p >/dev/null 2>&1 && { echo $$p; break; }; done)
  VENV_BIN := $(VENV)/bin
endif

PYTHON := $(VENV_BIN)/python
API_STAMP := $(VENV)/.installed
WEB_STAMP := $(WEB_DIR)/node_modules/.installed

.DEFAULT_GOAL := help

.PHONY: help setup env api-install web-install migrate admin superuser \
        api web test test-api test-web lint

help: ## Lista os comandos disponíveis
	@echo "Sistema de pedidos — comandos na raiz do repositório"
	@echo ""
	@grep -E '^[a-zA-Z0-9_-]+:.*?## ' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

setup: env api-install web-install migrate admin ## Primeira vez: .env, dependências, banco e usuário do Admin
	@echo ""
	@echo "Pronto. Rode 'make api' e 'make web' em dois terminais."

env: ## Cria o .env a partir do .env.example (se ainda não existir)
	@test -f $(ROOT_DIR)/.env || cp $(ROOT_DIR)/.env.example $(ROOT_DIR)/.env
	@echo ".env pronto"

api-install: $(API_STAMP) ## Cria o venv e instala as dependências Python

$(API_STAMP): $(API_DIR)/requirements.txt
	@$(PYTHON_BIN) -c 'import sys; sys.exit(sys.version_info < (3, 10))' 2>/dev/null || { \
		echo ""; \
		echo "Precisa de Python 3.10 ou mais novo (encontrado: $$($(PYTHON_BIN) --version 2>&1))."; \
		echo "Instale em https://www.python.org/downloads/ e rode 'make setup' de novo."; \
		echo ""; \
		exit 1; }
	cd $(API_DIR) && $(PYTHON_BIN) -m venv .venv
	$(PYTHON) -m pip install --upgrade pip
	$(PYTHON) -m pip install -r $(API_DIR)/requirements.txt
	@touch $@

web-install: $(WEB_STAMP) ## Instala as dependências do Next.js

$(WEB_STAMP): $(WEB_DIR)/package.json $(WEB_DIR)/package-lock.json
	cd $(WEB_DIR) && npm install
	@touch $@

migrate: api-install ## Aplica as migrations do Django (SQLite)
	cd $(API_DIR) && $(PYTHON) manage.py migrate

admin: api-install ## Cria o usuário do Admin com os dados do .env (idempotente)
	cd $(API_DIR) && $(PYTHON) manage.py ensure_admin

superuser: api-install ## Cria outro usuário do Admin, de forma interativa
	cd $(API_DIR) && $(PYTHON) manage.py createsuperuser

api: api-install ## API Django em http://localhost:8000
	cd $(API_DIR) && $(PYTHON) manage.py runserver

web: web-install ## App Next.js em http://localhost:3000
	cd $(WEB_DIR) && npm run dev

test-api: api-install ## Só os testes Django
	cd $(API_DIR) && $(PYTHON) manage.py test

test-web: web-install ## Só os testes Vitest
	cd $(WEB_DIR) && npm test

test: test-api test-web ## Roda todos os testes (Django + Vitest)

lint: web-install ## ESLint e TypeScript do app web
	cd $(WEB_DIR) && npm run lint && npm run typecheck
