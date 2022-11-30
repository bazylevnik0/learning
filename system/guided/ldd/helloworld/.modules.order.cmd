cmd_/home/test/helloworld/modules.order := {   echo /home/test/helloworld/helloworld.ko; :; } | awk '!x[$$0]++' - > /home/test/helloworld/modules.order
