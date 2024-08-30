SHELL := bash
PHONY := clean anura types default
.DEFAULT_GOAL := default
.NOTPARALLEL: default anura

clean:
	@echo "Cleaning up project..."
	@rm -rf anuraos
	@rm -rf templates/types/
	@rm -rf templates/base/anura_env/

anura:
	@echo "Building anura & adding the proper assets..."
	@-[ ! -e 'anuraos' ] && git clone -b v2.0 --recursive https://github.com/mercuryworkshop/anuraos
	@cd anuraos && make all && cd -
	@rm -rf templates/base/anura_env/
	@mkdir -p templates/base/anura_env/
	@cp -r anuraos/public/ templates/base/anura_env/
	@cp -r anuraos/apps/ templates/base/anura_env/
	@cp -r anuraos/build/ templates/base/anura_env/
	@rm -rf templates/base/anura_env/public/x86images/
	@rm -rf templates/base/anura_env/public/bios/
	@rm -rf templates/base/anura_env/apps/term.app/
	@rm -rf templates/base/anura_env/apps/marketplace.app/

types:
	@echo "Generating types from Anura..."
	@cd anuraos && npx tsc -d --emitDeclarationOnly --declarationMap --outDir ../templates/ts/types/

default: anura types
