cd ria-test-admin
docker build . -t ria/admin 
cd ../ria-test-app
docker build . -t ria/app
cd ../ria-test-backend
docker build . -t ria/backend
