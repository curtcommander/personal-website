# english
rm -r dist/en/* 2> /dev/null
node build/buildFiles.js en
bash build/minify.sh en

# spanish
rm -r dist/sp/* 2> /dev/null
node build/buildFiles.js sp
bash build/minify.sh sp