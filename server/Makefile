build:
	cd ../client; tsc; echo "Frontend app build done."
	docker build -t s .

run: build
	docker-compose up -d	

down:
	docker-compose down