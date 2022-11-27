from ecc import *
from helper import *
from tx import *

#transaction

#Version
#get and serialize
#get
#version = 1
#serialize
#print(int_to_little_endian(version,4))
# or print(int_to_little_endian(version,4).hex())


#Inputs
#its array of input
#each intput
    #number of inputs
        #previous transaction id // 35aa754647db018bcb9703a9701467afe2b453e5d9715d423d8bbc2fa05d5b50
        #previous transaction index
    #script sig
    #sequence
#!
#input
# = TxIn(prev_tx, prev_index, script_sig=None, sequence=0xffffffff)
#print(output.serialize())


#Outputs
    #number of outputs
        #amount
        #ScriptPubKey
#!
#output
#output = TxOut(amount, script_pubkey)
#print(output.serialize())

#Locktime
#locktime = 0
#print(int_to_little_endian(locktime,4))
#or print(int_to_little_endian(locktime,4).hex())