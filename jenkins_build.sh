# rm -rf node_modules
# cnpm install
# echo 'Success, 恭喜你，安装完成!!!!!!'
echo 'my working dir:'
pwd
npm run client:prodefault
npm run server:prod
cp ./package.json ./dist