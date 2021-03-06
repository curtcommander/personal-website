# minify js
 find dist/frontend/js/ -type f \
    -name "*.js" ! -name "*.min.*" \
    -exec terser -c toplevel --keep-fnames -o {}.min -- {} \; \
    -exec rm {} \; \
    -exec mv {}.min {} \; \
    #-exec echo "minified "{} \;

# minify css
find dist/frontend/css/ -type f \
    -name "*.css" ! -name "*.min.*" \
    -exec cleancss -o {}.min {} \; \
    -exec rm {} \; \
    -exec mv {}.min {} \; \
    #-exec echo "minified "{} \;