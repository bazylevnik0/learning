cmd_/home/test/char/char.mod := printf '%s\n'   char.o | awk '!x[$$0]++ { print("/home/test/char/"$$0) }' > /home/test/char/char.mod
