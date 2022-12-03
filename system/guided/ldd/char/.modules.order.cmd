cmd_/home/test/char/modules.order := {   echo /home/test/char/char.ko; :; } | awk '!x[$$0]++' - > /home/test/char/modules.order
