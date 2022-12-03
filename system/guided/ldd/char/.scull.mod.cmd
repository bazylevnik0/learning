cmd_/home/test/scull/scull.mod := printf '%s\n'   scull.o | awk '!x[$$0]++ { print("/home/test/scull/"$$0) }' > /home/test/scull/scull.mod
