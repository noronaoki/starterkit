GULP = ./node_modules/gulp/bin/gulp.js

setup:
	npm install

update:
	npm update

server:
	$(GULP) default

compress:
	$(GULP) compress
