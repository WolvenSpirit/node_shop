build:
	cd ../client; tsc; echo "Frontend app build done."
	cd .. ; cp -r client server/bin/client_build
	docker build -t s .

run: build
	docker-compose up -d --force-recreate	

down:
	docker-compose down