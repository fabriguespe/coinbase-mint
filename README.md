# Mint on Zora via Frame

Supported networks: {ethereum, zora, base, optimism, arbitrum}
Supported NFT erc1155 erc721

warpcast link: `https://warpcast.com/~/developers/frames?url=https://xmtp-coinbase-mint-frame.vercel.app/{chain}/{nftAddress}/{tokenId optional}`
//
erc1155:

- Zora

  - zora: https://zora.co/collect/zora:0xfdd784e1566f20324d3da4aff4bdbe4809437e1b/11
  - frame: http://localhost:3000/zora/0xFdd784E1566f20324d3da4AFf4bdBE4809437e1b/11
  - warpcast: https://warpcast.com/~/developers/frames?url=https://xmtp-coinbase-mint-frame.vercel.app/zora/0xFdd784E1566f20324d3da4AFf4bdBE4809437e1b/11

- Base:

  - zora: https://zora.co/collect/base:0xA0487Df3ab7a9E7Ba2fd6BB9acDa217D0930217b/48
  - frame: http://localhost:3000/base/0xA0487Df3ab7a9E7Ba2fd6BB9acDa217D0930217b/48
  - warpcast: https://warpcast.com/~/developers/frames?url=https://xmtp-coinbase-mint-frame.vercel.app/base/0xA0487Df3ab7a9E7Ba2fd6BB9acDa217D0930217b/48

- Eth Not mintable:
  - zora: https://zora.co/collect/eth:0xabefbc9fd2f806065b4f3c237d4b59d9a97bcac7/31865
  - frame: http://localhost:3000/eth/0xabefbc9fd2f806065b4f3c237d4b59d9a97bcac7/31865

Example erc721

- Eth:

  - zora: https://zora.co/collect/eth:0xd4307e0acd12cf46fd6cf93bc264f5d5d1598792
  - frame: http://localhost:3000/eth/0xd4307e0acd12cf46fd6cf93bc264f5d5d1598792

- ETh (Pudgy)
  - zora: https://zora.co/collect/eth:0xbd3531da5cf5857e7cfaa92426877b022e612cf8/2150
  - frame: http://localhost:3000/eth/0xbd3531da5cf5857e7cfaa92426877b022e612cf8/2150

Other

- base:
  - frame: http://localhost:3000/base/0xa902601ece8b81d906b7deceb67f5badcbdff7df/1

MINT Coinbase wallet w standard https://url/eip155:[chainId]:[nftType]:[contractAddress]

- CoffeDays

  - https://wallet.coinbase.com/nft/mint/eip155:8453:erc721:0xf16755b43eE1a458161f0faE5a9124729f4f6B1B
  - frame: http://localhost:3000/eip155/8453/erc721/0xf16755b43eE1a458161f0faE5a9124729f4f6B1B

- Let the shield shine:

  - https://wallet.coinbase.com/nft/mint/eip155:8453:erc721:0x2a8e46E78BA9667c661326820801695dcf1c403E
  - frame: http://localhost:3000/eip155/8453/erc721/0x2a8e46E78BA9667c661326820801695dcf1c403E

- new
  - coinbase: https://wallet.coinbase.com/nft/mint/eip155:8453:erc1155:0x9a83e7b27b8a9b68e8dc665a0049f2f004287a20:1
  - frame: http://localhost:3000/eip155/8453/erc1155/0x9a83e7b27b8a9b68e8dc665a0049f2f004287a20/1
  - warpcast: https://warpcast.com/~/developers/frames?url=https://xmtp-coinbase-mint-frame.vercel.app/8453/erc1155/0x9a83e7b27b8a9b68e8dc665a0049f2f004287a20/1
