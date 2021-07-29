build:
	cd ../client; npm run build:dev; echo "Frontend app build done."
	cd .. ; cp -r client/build server/bin/client_dist
	docker build -t s .

run: build
	docker-compose up -d --force-recreate	

down:
	docker-compose down