export const Abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "requestAuthor",
        type: "address",
      },
    ],
    name: "approveElevationRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "shopCity",
        type: "string",
      },
    ],
    name: "approveMoneyRequest",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "cancelElevationRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "cancelMoneyRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "enum ShopManager.Role",
        name: "requiredRole",
        type: "uint8",
      },
      {
        internalType: "string",
        name: "requiredShop",
        type: "string",
      },
    ],
    name: "changeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "city",
        type: "string",
      },
    ],
    name: "deleteShop",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum ShopManager.Role",
        name: "requiredRole",
        type: "uint8",
      },
      {
        internalType: "string",
        name: "requiredShop",
        type: "string",
      },
    ],
    name: "newElevateRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "requiredSum",
        type: "uint256",
      },
    ],
    name: "newMoneyRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "shop",
        type: "string",
      },
      {
        internalType: "string",
        name: "content",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "rate",
        type: "uint8",
      },
      {
        internalType: "uint32",
        name: "answer",
        type: "uint32",
      },
    ],
    name: "newReview",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "city",
        type: "string",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "newShop",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "addr",
        type: "address",
      },
      {
        internalType: "string",
        name: "username",
        type: "string",
      },
      {
        internalType: "string",
        name: "fullName",
        type: "string",
      },
      {
        internalType: "bytes32",
        name: "pwHash",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "secretHash",
        type: "bytes32",
      },
    ],
    name: "newUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "review",
        type: "uint32",
      },
      {
        internalType: "bool",
        name: "positive",
        type: "bool",
      },
    ],
    name: "rateReview",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
  {
    inputs: [],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "username",
        type: "string",
      },
      {
        internalType: "bytes32",
        name: "pwHash",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "secretHash",
        type: "bytes32",
      },
    ],
    name: "authenticateUser",
    outputs: [
      {
        internalType: "string",
        name: "loginAuthenticated",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "shopCity",
        type: "string",
      },
    ],
    name: "getMoneyRequest",
    outputs: [
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMoneyRequests",
    outputs: [
      {
        internalType: "string[]",
        name: "moneyRequesters",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "reviewId",
        type: "uint32",
      },
    ],
    name: "getReview",
    outputs: [
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "string",
        name: "shop",
        type: "string",
      },
      {
        internalType: "string",
        name: "content",
        type: "string",
      },
      {
        internalType: "uint32",
        name: "answer",
        type: "uint32",
      },
      {
        internalType: "uint32[]",
        name: "answers",
        type: "uint32[]",
      },
      {
        internalType: "uint8",
        name: "rate",
        type: "uint8",
      },
      {
        internalType: "address[]",
        name: "likes",
        type: "address[]",
      },
      {
        internalType: "address[]",
        name: "dislikes",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "city",
        type: "string",
      },
    ],
    name: "getShopByCity",
    outputs: [
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
      {
        internalType: "string",
        name: "shopCity",
        type: "string",
      },
      {
        internalType: "address",
        name: "shopOwner",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "getShopByOwnerAddress",
    outputs: [
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
      {
        internalType: "string",
        name: "shopCity",
        type: "string",
      },
      {
        internalType: "address",
        name: "shopOwner",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "city",
        type: "string",
      },
    ],
    name: "getShopReviews",
    outputs: [
      {
        internalType: "uint32[]",
        name: "reviewIds",
        type: "uint32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getShops",
    outputs: [
      {
        internalType: "string[]",
        name: "shopCities",
        type: "string[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "getUser",
    outputs: [
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
      {
        internalType: "string",
        name: "username",
        type: "string",
      },
      {
        internalType: "string",
        name: "fullName",
        type: "string",
      },
      {
        internalType: "enum ShopManager.Role",
        name: "role",
        type: "uint8",
      },
      {
        internalType: "string",
        name: "shop",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "login",
        type: "string",
      },
    ],
    name: "getUserAddress",
    outputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "userAddress",
        type: "address",
      },
    ],
    name: "getUserReviews",
    outputs: [
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
      {
        internalType: "uint32[]",
        name: "reviewIds",
        type: "uint32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
