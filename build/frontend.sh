# build files for frontend
rm -r dist/frontend/* 2> /dev/null
node build/buildFiles.js
bash build/minify.sh
