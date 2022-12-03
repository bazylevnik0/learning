cmd_/home/test/helloworld/helloworld.mod := printf '%s\n'   helloworld.o | awk '!x[$$0]++ { print("/home/test/helloworld/"$$0) }' > /home/test/helloworld/helloworld.mod
