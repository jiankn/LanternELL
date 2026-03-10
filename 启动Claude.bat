@echo off
:: 切换到目标目录
cd /d "D:\Web\autodataflow"

:: 设置代理环境变量
set HTTPS_PROXY=http://127.0.0.1:10808
set HTTP_PROXY=http://127.0.0.1:10808

:: 启动 Claude
start "" claude
