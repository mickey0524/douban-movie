# douban-movie
基于python(flask)和react爬取豆瓣电影，进行数据展示以及数据可视化分析

## 前言

最近沉迷python，加之想用react做一个多页项目，于是花费工作空闲时间完成了这个网站，有关python爬虫的基础可以参考我的另外一个github仓库，[python爬虫基础](https://github.com/mickey0524/web-crawler)，有关flask初始化项目的脚手架可以参考这个github仓库，[flask 脚手架](https://github.com/mickey0524/flask-template)

## 技术栈

react + webpack + less + es6/7 + python + flask + jieba

## 项目运行

```
git clone git@github.com:mickey0524/douban-movie.git  

cd douban-movie

npm install / yarn

npm run dev + ./run.py (本地运行)

npm run build (编译打包)
```

## 目录结构

```
.
|____.babelrc
|____.DS_Store
|____.gitignore
|____app
| |____.DS_Store
| |______init__.py
| |______init__.pyc
| |____main
| | |______init__.py
| | |______init__.pyc
| | |____views.py
| | |____views.pyc
| |____restful
| | |______init__.py
| | |______init__.pyc
| | |____api.py
| | |____api.pyc
| |____spider
| | |______init__.py
| | |______init__.pyc
| | |____comment_word_frequency.py
| | |____comment_word_frequency.pyc
| | |____movie_detail.py
| | |____movie_detail.pyc
| | |____movie_index.py
| | |____movie_index.pyc
| | |____review_word_frequency.py
| | |____review_word_frequency.pyc
| | |____word_frequency.pyc
| |____static
| | |____.DS_Store
| | |____css
| | | |____.DS_Store
| | | |____libs
| | | | |____.DS_Store
| | | | |____normalize.css
| | | |____pages
| | | | |____.DS_Store
| | | | |____common.css
| | | | |____detail.css
| | | | |____home.css
| | |____img
| | | |____.DS_Store
| | | |____left.png
| | | |____loading.png
| | | |____right.png
| | | |____stars_empty.png
| | | |____stars_full.png
| | |____js
| | | |____.DS_Store
| | | |____libs
| | | | |____.DS_Store
| | | |____pages
| | | | |____.DS_Store
| | | | |____common.js
| | | | |____detail.js
| | | | |____home.js
| |____templates
| | |____main
| | | |____detail.html
| | | |____home.html
|____client
| |____common
| | |____loading
| | | |____index.jsx
| | | |____index.less
| | |____photo
| | | |____index.jsx
| | | |____index.less
| |____pagelet
| | |____detail
| | | |____index.js
| | | |____index.jsx
| | | |____index.less
| | |____home
| | | |____index.js
| | | |____index.jsx
| | | |____index.less
|____configs.py
|____configs.pyc
|____package.json
|____README.md
|____run.py
|____webpack.config.js
|____yarn.lock
```

## 项目截图

![pic](./demo.gif)
