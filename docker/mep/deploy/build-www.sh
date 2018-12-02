#!/usr/bin/env bash
cd /work/golery
export NODE_OPTIONS=--max_old_space_size=5000
yarn run build
cd -

