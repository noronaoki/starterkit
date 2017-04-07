# 概要
Slim、Sass（scss記法）、Javascriptで構成されたスターターキットです。  
静的なページを作る際に必要なパッケージやツールが内包されているので準備の手間が省けます。

# 特徴

|名称|説明|
|:--|:--|
|HTMLテンプレートエンジン|Slimを採用|
|CSS|ITCSSを踏襲したカスケーディング問題が起こりづらいアーキテクチャ|
|JS|Babelを内包しているのでES2015での利用も可能|
|スタイルガイドジェネレータ|aigisを採用<br>Sassを編集すると自動的にビルドされる|
|browserSync|複数のブラウザを同時に更新してくれる<br>スクロールやクリックなどのアクションも同期されるのでレスポンシブデザインの確認に最適|
|Spritesmith|スプライトシートの自動生成パッケージ<br>画像を更新するとSassもアップデートしてくれる|
|Autoprefixer|ベンダープリフィックスを自動で生成・削除してくれる|
|TinyPNG|画像のコンプレッサー|

# 使い方
## 必要なパッケージなどのインストールと準備
- グローバルに必要なもの
  - node
    - https://nodejs.org/en/ `v6.10.2 LTS` というやつをダウンロードしてください
  - npm
    - `npm i -g npm`
  - Gulp
    - `npm i -g gulp`
  - Slim
    - `gem install slim`
  - Sass
    - `gem install sass`
- プロジェクトごとに必要なもの
  - 下記のコマンドで一括インストール
    - `make setup`
- タスクランナーの起動
  - `make server`でローカルサーバが起動します。  

これで準備完了です。  
後は`src`内にあるSlim、Sass、JSを編集→保存すれば`dist`というディレクトリの中にコンパイルされたファイル群がビルドされ、ブラウザが自動更新されます。
