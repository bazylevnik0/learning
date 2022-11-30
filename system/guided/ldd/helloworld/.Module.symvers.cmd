cmd_/home/test/helloworld/Module.symvers := sed 's/ko$$/o/' /home/test/helloworld/modules.order | scripts/mod/modpost  -a  -o /home/test/helloworld/Module.symvers -e -i Module.symvers  -N -T -
