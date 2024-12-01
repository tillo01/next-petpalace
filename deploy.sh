#!/bin/bash

#PRODUCTION

git reset --hard
git checkout master
git pull origin master

yarn 
yarn run build

docker compose up -d