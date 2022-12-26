# A Light-ish Cryptocurrency

In the process of building a raspberry pi for offline access, I obviously need a way to include a crypto currency.

Assuming no internet and low power from solar panels for the pi and for user's phones, the final ledger must be trustworthy, 
secure, and low power (no pow). While a true crypto should be decentralised, it is much easier and more fitting to the situation for it 
to be centralised as it is unlikely to be able to maintain node connections. Given these constraints, here is how I designed it.

## Maintaining order
Given the goal of processing transactions, we must have a sender, a receiver, and an amount.
Just as important is the order of the transactions. For this, the sender also includes the previous transaction's hash. Late transactions 
(transactions that have a previous hash that is not the current one) are ignored.

## Proving ownership
However, what stops someone from just creating a fake transaction? For this, a signing function is used. In my case I used ecdsa; specificly the 
SECP256k1 curve. For each transaction a valid signature must be provided to prove it comes from the sender's address.

## Tokenomics
Another issue is how money is introduced into the system. To remedy this, a random user that has interacted with the ledger is selected and rewarded 
log(total_transactions) coins. However we can do better than simply trusting that the centralised server has fairly rewarded the users. The method 
I came up with to replace the randomly selected user is to mod the transaction's hash against the total number of users in order by their 
interaction with the ledger. The resulting index is then used to select a user and reward them accordingly.

## Issues
Because the reward is determined by the transaction hash which can be changed by the user, the user can "mine" a transaction so that he 
will be rewarded. This can also serve as a method to prove the health of the ledger as a "steeper" distribution means there is more work 
in the ledger. 
The trust score can be calculated as log(n^m), where m is 1 / average wallet size and n is the number of wallets. Higher trust = more work. 
This, however, does not account for the natural tendancy for wallet sizes to vary in a similar manner and should be taken with a pinch of salt.

### Coding the transaction
Heres a python script to represent the above transaction:
```python
import marshal, os, hashlib, ecdsa, math, base64

CURVE = ecdsa.SECP256k1         # The curve to use
BLOCK_SIZE = 512                # Block size of transaction (>400)

def marshal_loads_padding(data):
    while data.startswith(b"\0"):
        data = data[1:]
    return marshal.loads(data)

def marshal_dumps_padding(data, block = BLOCK_SIZE):
    data = marshal.dumps(data)
    return b"\0" * (block - len(data)) + data

class Transaction:
    def __init__(self, prev_hash:bytes, from_addr:bytes, to_addr:bytes, amount:int, signature:bytes=b"\0"):
        assert isinstance(amount, int) and amount>=0, "amount must be integer & positive"

        self.prev_hash = prev_hash
        self.from_addr = from_addr
        self.to_addr = to_addr
        self.amount = amount.to_bytes((amount.bit_length() + 7) // 8, 'big')
        self.signature = signature
    
    def __str__(self) -> str:
        return f"{'-'*50}\n \
        Previous hash: {self.prev_hash.hex()}\n \
        From: {self.from_addr.hex()}\n \
        To: {self.to_addr.hex()}\n \
        Amount: {int.from_bytes(self.amount, 'big')}\n \
        Signature: {self.signature.hex()}\n \
        Hash: {self.hash.hex()}\n \
        Is valid: {self.valid}\n \
        Raw len: {len(self.dump)}\n{'-'*50}"

    @property
    def hash(self) -> bytes:
        return hashlib.sha256(self.prev_hash + self.from_addr + self.to_addr + self.amount).digest()
    
    @property
    def dump(self) -> bytes:
        return marshal_dumps_padding({"prev_hash":self.prev_hash, "from_addr":self.from_addr, "to_addr": self.to_addr, "amount":int.from_bytes(self.amount, 'big'), "signature":self.signature})

    @property
    def valid(self) -> bool:
        try:
            vk = ecdsa.VerifyingKey.from_string(self.from_addr, curve=CURVE)
            vk.verify(self.signature, self.hash)
            return True
        except:
            return False
```

I also wrote a ledger class to handle transactions and save them in binary format to the disk.

```python
GENISIS_BLOCK = Transaction(b"\0", b"\0", b"\0", 0, b"\0")

class Ledger:
    def __init__(self, src="main.lgr"):

        if not os.path.exists(src):
            print("Writing genisis block...")
            with open(src, "wb") as f:
                f.write(GENISIS_BLOCK.dump)   

        self.src = src
        
        self.curr_len, self.users = 0, {}
        while True:
            print(f"Reading transaction: {self.curr_len}")

            trx = self.get_trx(self.curr_len)

            if trx is None:
                print(f"End of transactions")
                break
            
            self.users.setdefault(trx.from_addr, 0)
            self.users.setdefault(trx.to_addr, 0)

            self.users[trx.from_addr] -= int.from_bytes(trx.amount, 'big')
            self.users[trx.to_addr] += int.from_bytes(trx.amount, 'big')

            reward_index = int.from_bytes(trx.hash, 'big') % len(self.users)
            reward_key = list(self.users)[reward_index]

            self.users[reward_key] += self.reward_function()

            self.curr_len += 1

        print(f"Latest hash: {self.latest_hash}")
        
    @property
    def latest_hash(self):
        return self.get_trx(self.curr_len-1).hash
            
    def reward_function(self):
        return int(10 / math.log(len(self.users) + 1))
            
    def get_trx(self, id):
        with open(self.src, "rb") as f:
            try:
                f.seek(id * BLOCK_SIZE)
                data = marshal_loads_padding(f.read(BLOCK_SIZE))

                return Transaction(
                    prev_hash=data["prev_hash"],
                    from_addr=data["from_addr"],
                    to_addr=data["to_addr"],
                    amount=data["amount"],
                    signature=data["signature"]
                )
            except Exception as e:
                print(e)
                return None
    
    def add_trx(self, trx: Transaction):

        assert self.users[trx.from_addr] <= trx.amount, "Cannot spend more than account has"
        assert trx.prev_hash == self.latest_hash, "Transaction is too old, invalid previous hash"
        assert trx.valid, "Signature not valid"

        with open(self.src, "wb") as f:
            # Write latest block
            f.write(trx.dump)
            self.curr_len += 1

            self.users.setdefault(trx["from_addr"], 0)
            self.users.setdefault(trx["to_addr"], 0)

            self.users[trx.from_addr] -= trx.amount
            self.users[trx.to_addr] += trx.amount

            reward_index = int.from_bytes(trx.hash, 'big') % len(self.users)
            reward_key = list(self.users)[reward_index]

            self.users[reward_key] += self.reward_function()

ledger = Ledger()
```

And finally a fastapi backend to receive transactions from other users in the form of an api.

```python
from fastapi import FastAPI
from fastapi.exceptions import HTTPException
from fastapi.responses import HTMLResponse

app = FastAPI()

@app.get("/", response_class=HTMLResponse)
async def root():
    return """
    <h1>Blockchain API</h1>
    """

@app.get("/latest_hash")
async def latest_hash():
    return {"error": False, "result": ledger.latest_hash.hex()}

@app.get("/amount")
async def amount(addr: str):
    """
    addr is hex encoded from the original digest
    Returns the amount that the account has.
    """
    return {"error": False, "result": ledger.users.get(bytes.fromhex(addr), 0)}

@app.get("/push_trx")
async def push_trx(prev_hash:str, from_addr:str, to_addr:str, amount:int, signature:str):
    """
    prev_hash, from_addr, to_addr & signature must be hex encoded from original digest.
    Returns 
    """
    try:

        t = Transaction(
            prev_hash=bytes.fromhex(prev_hash),
            from_addr=bytes.fromhex(from_addr),
            to_addr=bytes.fromhex(to_addr),
            amount=amount,
            signature=bytes.fromhex(signature)
        )

        ledger.add_trx(t)

    except Exception as e:
        raise HTTPException(400, detail=f"Error raised: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## Some caveats
You may notice that the transactions are saved via marshal + padding. This is a relatively pydandic way of saving transactions, and it might be better
off to just save each transaction in json or a more rigorous binary format.

## Closing notes
Yeah this was just an excuse to try and design my own cryptocurrency; but also to understand cryptography and trying to exploit my own code. 
If you find any bugs or want the latest code, view the repository at (insert link here lol).

