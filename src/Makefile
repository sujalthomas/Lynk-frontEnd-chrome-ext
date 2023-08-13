
build:
	npm run build

go:
	npm start


# Docker

docker-build: build
	docker build --platform=linux/amd64 -t lynk-front .
	docker images


docker-network:
	docker network create lynk-network

docker-run: docker-build
	docker run --platform=linux/amd64 --name lynk-front -td -p 80:8080 lynk-front
	docker ps

docker-clean:
	docker stop lynk-front
	docker rm lynk-front
	docker rmi lynk-front

docker-shell:
	docker exec -it lynk-front bash 

docker-push:
	docker login
	docker build --platform=linux/amd64 -t renegadepanda/lynk-front:v2.0 .
	docker push renegadepanda/lynk-front:v2.0 

#Postgres

postgres-network:
	docker network create --driver bridge lynk-network

postgres-run:
	docker run --name lynk-front -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=root -e POSTGRES_DB=lynk -p 5433:5432 --network=lynk-network -d postgres

postgres-shell:
	docker exec -it lynk-front psql -U admin -d lynk
	
postgres-login:
	psql -U admin -d lynk














# Compose

network-ls:
	docker network ls 

network-create:
	docker network create --driver bridge $(network)

network-prune:
	docker network prune

compose-up:
	docker-compose up --scale gumball=2 -d

compose-down:
	docker-compose down 	

lb-stats:
	echo "user = admin | password = admin"
	open http://localhost:1936

lb-test:
	open http://localhost





















# Pod

pod-run:
	kubectl apply -f pod.yaml

pod-list:
	kubectl get pods

pod-desc:
	kubectl describe pods lynk-front

pod-delete:
	kubectl delete -f pod.yaml

pod-shell:
	kubectl exec -it lynk-front -- /bin/bash

pod-logs:
	kubectl logs -f lynk-front

# Deployment

deployment-create:
	kubectl create -f deployment.yaml --save-config 

deployment-get:
	kubectl get deployments

deployment-get-pods:
	kubectl get pods -l name=lynk-front

deployment-pod-shell:
	kubectl exec -it $(pod) -- /bin/bash

deployment-upgrade:
	kubectl apply  -f deployment.yaml

deployment-delete:
	kubectl delete deployment lynk-front-deployment

# Service

service-create:
	kubectl create -f service.yaml

service-get:
	kubectl get services

service-get-ip:
	kubectl get service lynk-front -o wide

service-delete:
	kubectl delete service lynk-front

# Ingress

ingress-apply:
	kubectl apply -f ingress.yaml

ingress-ip:
	kubectl get ingress lynk-front-ingress




