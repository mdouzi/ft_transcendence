#!/bin/zsh
docker system prune -a --volumes
rm -rf ./postgres/*

