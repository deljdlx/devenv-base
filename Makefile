# ================================================
# Dev Environment Makefile (base / tools / reset)
# ================================================

# Load .env variables if present
-include .env

# Default compose project name (fallback)
PROJECT_NAME ?= devenv-base
TOOLS_FILE ?= docker-compose.tools.yml
APP_FILE ?= docker-compose.yml

# Default network shared by app + tools
NETWORK ?= app-net

.PHONY: help start destroy destroy-hard rebuild ps logs network clean

help: ## Show this help
	@awk 'BEGIN {FS = ":.*##"}; /^[a-zA-Z0-9_-]+:.*##/ {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | sort

profile: ## launch docker compose with profile passed as argument (e.g. make profile PROFILE=messaging)
	docker compose --profile $(PROFILE) up -d


start:
	@bash ./launch.sh


# ------------------------------------------------
# 🔥 Destruction & Reset
# ------------------------------------------------

start: ## Start all containers
	@bash ./launch.sh

destroy: ## Destroy all containers, networks, and volumes from $(PROJECT_NAME)
	@echo "⚠️  Destroying all containers, networks, and volumes for $(PROJECT_NAME)..."
	@docker compose -f $(APP_FILE) down -v --remove-orphans || true
	@docker compose -f $(TOOLS_FILE) down -v --remove-orphans || true
	@docker network rm $(NETWORK) || true
	@docker system prune -af --volumes
	@echo "✅ All containers, networks, and volumes removed."

destroy-hard: ## Full wipe (also removes images) — ⚠️ heavy operation
	@echo "💣 Full wipe: containers + volumes + images..."
	@$(MAKE) destroy
	@docker image prune -a -f
	@echo "✅ All Docker images removed."

# ------------------------------------------------
# 🧱 Rebuild Environment (from scratch)
# ------------------------------------------------

rebuild: ## Recreate everything (tools + app)
	@echo "🔁 Rebuilding full environment..."
	@docker network create $(NETWORK) || true
	@docker compose -f $(TOOLS_FILE) pull
	@docker compose -f $(TOOLS_FILE) --profile proxy up -d
	@docker compose -f $(TOOLS_FILE) --profile dev up -d
	@docker compose -f $(TOOLS_FILE) --profile observability up -d
	@docker compose -f $(TOOLS_FILE) --profile monitoring up -d
	@docker compose -f $(APP_FILE) pull
	@docker compose -f $(APP_FILE) up -d --build --pull always
	@echo "✅ Environment rebuilt successfully."

# ------------------------------------------------
# 🧰 Utilities
# ------------------------------------------------

ps: ## Show running containers
	@docker compose -f $(TOOLS_FILE) ps
	@docker compose -f $(APP_FILE) ps

logs: ## Tail logs from app and tools
	@docker compose -f $(TOOLS_FILE) logs -f --tail=50
	@docker compose -f $(APP_FILE) logs -f --tail=50

network: ## Recreate the shared app-net
	@docker network rm $(NETWORK) || true
	@docker network create $(NETWORK) || true
	@echo "✅ Network $(NETWORK) recreated."

clean: ## Remove all dangling data (prune everything not used)
	@docker system prune -af
	@docker volume prune -f
	@docker network prune -f
	@echo "🧹 Docker environment cleaned."

# ---------------------------------
