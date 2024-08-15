#!/bin/bash -e

# start script
CWD=`/usr/bin/dirname $0`
cd $CWD

for arg in $@; do
  ./${arg}.sh
done

