# build refreshInstagramToken function
FUNC=refreshInstagramToken
DEST=dist/$FUNC/
rm -r $DEST 2> /dev/null
mkdir $DEST
cp src/instagram/refreshInstagramToken.js $DEST
cp src/instagram/tokenInstagram.js $DEST
cd $DEST
zip -rmq $FUNC.zip *
mv $FUNC.zip ..
cd ..
rm -r $FUNC
