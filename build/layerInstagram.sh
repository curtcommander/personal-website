# build layer for instgram integration
# used by refreshInstagramToken, updateFrontend

# create file structure
NAME=layerInstagram
DEST=dist/$NAME/
rm -r $DEST 2> /dev/null
mkdir $DEST
cd $DEST
mkdir nodejs
cd nodejs

# install packages
npm init -y > /dev/null
declare -a DEPS=( "axios" "sharp" )
for DEP in ${DEPS[@]}; do
    npm i $DEP
done

# zip file
cd ..
zip -rmq $NAME.zip nodejs
mv $NAME.zip ..
cd ..
rm -r $NAME
