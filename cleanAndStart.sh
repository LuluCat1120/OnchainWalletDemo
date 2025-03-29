#!/bin/bash

# 停止任何正在运行的Metro进程
echo "Stopping any running Metro processes..."
pkill -f "expo start" || true

# 清理缓存和临时文件
echo "Cleaning cache and temporary files..."
rm -rf node_modules/.cache
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-map-*

# 安装依赖（可选）
# echo "Reinstalling dependencies..."
# npm install

# 使用clear标志启动项目
echo "Starting project with clean cache..."
npx expo start --clear

echo "Done!" 