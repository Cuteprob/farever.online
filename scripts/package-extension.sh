#!/bin/bash

# 创建临时目录
mkdir -p dist/extension

# 复制必要文件
cp -r .next/server/app/manifest.webmanifest dist/extension/manifest.webmanifest
cp -r public/icons dist/extension/
cp -r .next/static dist/extension/static
cp -r public/assets dist/extension/assets

# 创建 ZIP 文件
cd dist/extension
zip -r ../chrome-extension.zip .
cd ../..

echo "✅ Extension package created at dist/chrome-extension.zip"
