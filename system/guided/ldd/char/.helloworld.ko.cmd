cmd_/home/test/helloworld/helloworld.ko := ld -r -m elf_x86_64 -z noexecstack --no-warn-rwx-segments --build-id=sha1  -T scripts/module.lds -o /home/test/helloworld/helloworld.ko /home/test/helloworld/helloworld.o /home/test/helloworld/helloworld.mod.o;  true
