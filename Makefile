SHELL := bash
PHONY := clean anura types default
.DEFAULT_GOAL := default
.NOTPARALLEL: default anura

clean:
	@echo "Cleaning up project..."
	@rm -rf anuraos
	@rm -rf create-anura-app/templates/types/
	@rm -rf create-anura-app/templates/base/anura_env/

anura:
	@echo "Building anura & adding the proper assets..."
	@-[ ! -e 'anuraos' ] && git clone -b v2.0 --recursive https://github.com/mercuryworkshop/anuraos
	@cd anuraos && make all && cd -
	@rm -rf create-anura-app/templates/base/anura_env/
	@mkdir -p create-anura-app/templates/base/anura_env/
	@cp -r anuraos/public/ create-anura-app/templates/base/anura_env/
	@cp -r anuraos/apps/ create-anura-app/templates/base/anura_env/
	@cp -r anuraos/build/ create-anura-app/templates/base/anura_env/
	@rm -rf create-anura-app/templates/base/anura_env/public/x86images/
	@rm -rf create-anura-app/templates/base/anura_env/public/bios/
	@jq '.apps += ["__mnt"]' create-anura-app/templates/base/anura_env/public/config.json > config.json.tmp && mv config.json.tmp create-anura-app/templates/base/anura_env/public/config.json
	@jq '.defaultsettings.applist += ["__mnt"]' create-anura-app/templates/base/anura_env/public/config.json > config.json.tmp && mv config.json.tmp create-anura-app/templates/base/anura_env/public/config.json
	@jq 'del(.x86)' create-anura-app/templates/base/anura_env/public/config.json > config.json.tmp && mv config.json.tmp create-anura-app/templates/base/anura_env/public/config.json

types:
	@echo "Generating types from Anura..."
	@cd anuraos && npx tsc -d --emitDeclarationOnly --declarationMap --outDir ../create-anura-app/templates/ts/types/
	@cd anuraos && npx tsc -d --emitDeclarationOnly --declarationMap --outDir ../anura-types/src/types/

default: anura types
