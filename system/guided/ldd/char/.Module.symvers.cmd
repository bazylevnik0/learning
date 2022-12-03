cmd_/home/test/char/Module.symvers := sed 's/ko$$/o/' /home/test/char/modules.order | scripts/mod/modpost  -a  -o /home/test/char/Module.symvers -e -i Module.symvers  -N -T -
