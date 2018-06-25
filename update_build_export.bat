#!/bin/sh
curdir=$(pwd)
./update_build.sh 2>&1 | tee last_build_log.log
su deployer <<'EOF'
    echo "Exporting images. This might take some time..."
    sudo docker save nginx rasd/data-worker rasd/server rasd/search-worker rasd/auth-worker rasd/cdr-worker rasd/reports-worker rasd/image-server rasd/frontend rabbitmq:3 rasd_redis-server redis:alpine | gzip -c > rasdimages.tgz

    cd backend
    mvn clean

    cd ..
    tar zcvf sources.tgz --exclude .git --exclude windows_deploy --exclude "*.log" backend frontend ~/.m2
    tar zcvf deploy_files.tgz backend/auth.conf backend/docker-compose.yml backend/Dockerfile-redis backend/nginx.conf \
        backend/import_images.sh backend/redis.conf backend/run_containers.sh backend/.env backend/docker-compose.dev.yml \
        backend/run_containers.prod.sh backend/logger
EOF
echo "Creating dist folder"
mkdir -p dist
echo "Move sources archive to dist"
mv ../sources.tgz dist/
echo "Move deploy_files archive to dist"
mv ../deploy_files.tgz dist/
echo "Move docker images archive to dist"
mv rasdimages.tgz dist/
cd ${curdir}
