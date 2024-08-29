SHELL := bash
PHONY := full-clean clean anura types default
.DEFAULT_GOAL := default
.NOTPARALLEL: default

full-clean:
	@rm -rf anuraos
	@rm -rf templates/types

clean:
	@rm -rf anuraos

anura:
	@git clone -b v2.0 --recursive https://github.com/mercuryworkshop/anuraos
	@cd anuraos && make all

types: anura
	@cd anuraos && npx tsc -d --emitDeclarationOnly --declarationMap --outDir ../templates/ts/types/

default: types clean
