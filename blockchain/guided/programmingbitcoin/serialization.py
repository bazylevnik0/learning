from ecc import *
from helper import *

#get private key and serialize
#get             //from secret
#priv = PrivateKey(5001)
#serialize
#print(priv.point.sec())
#                       //in hex
#or print(priv.point.sec().hex())

#get signature and serialize
#get z
#z = int.from_bytes(hash256(b'my message'), 'big')
#get priv       //from secret
#priv = PrivateKey(5001)
#get signature
#sig = priv.sign(z)
#serialize
#print(sig.der())
#                  //in hex
# or print(sig.der().hex())

