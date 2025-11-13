.PHONY: run install lint

install:
	pip install -r requirements.txt

run:
	./run.sh

lint:
	python -m pyflakes api || true
