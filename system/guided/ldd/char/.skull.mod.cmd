cmd_/home/test/skull/skull.mod := printf '%s\n'   skull.o | awk '!x[$$0]++ { print("/home/test/skull/"$$0) }' > /home/test/skull/skull.mod
