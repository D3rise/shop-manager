// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

/*
TODO: 
1. newCashRequest
2. operateCashRequest
3. getSelfElevateRequests
4. getSelfCashRequests
5. getElevateRequest
6. getCashRequest
*/

/*
Methods:
1. authUser(string username, string secret)
2. newUser(address addr, string username, string fullName, bytes32 secretHash)
3. getUser(string login)
4. getUserAddress(address addr)

5. newShop(address addr, string city, bytes32 secretHash)
6. getShop(string city)

7. newReview(string shop, string content, uint rate, uint32 parent)
8. getReview(uint id)
9. getShopReviews(string city)

10. changeRole(address addr, role, string shop, bool max)
11. newElevateRequest(role, string shop)
12. getElevateRequest()
13. operateElevateRequest(uint32 id, bool accept)
*/

contract ShopManager {
    address payable constant bank = payable(address(0));

    enum Role {
        BUYER,
        CASHIER,
        SHOP,
        PROVIDER,
        BANK,
        ADMIN
    }

    struct User {
        bool exists;
        string username;
        string shop;
        string fullName;
        bytes32 secretHash;
        Role maxRole;
        Role currentRole;
        uint32[] reviews;
        uint32[] elevRequests;
    }
    mapping(address => User) users;
    mapping(string => address) userLogins;
    string[] userLoginsArray;

    struct Shop {
        bool exists;
        string city;
        address owner;
        string[] cashiers;
        uint32[] reviews;
        uint32[] cashRequests;
    }
    mapping(string => Shop) shops;
    string[] shopCities;

    struct Review {
        bool exists;
        address author;
        string content;
        string shop;
        uint8 rate;
        uint32 parent;
        uint32[] children;
        address[] likes;
        address[] dislikes;
    }
    mapping(uint32 => Review) reviews;
    uint32[] reviewIds = [0]; // 0 - null review

    struct ElevateRequest {
        bool exists;
        address author;
        string shop;
        Role role;
    }
    mapping(uint32 => ElevateRequest) elevRequests;
    uint32[] elevRequestIds;

    struct CashRequest {
        bool exists;
        string shop;
        address payable sender;
        uint256 cash;
    }
    mapping(uint32 => CashRequest) cashRequests;
    uint32[] cashRequestIds;

    modifier requireRole(Role role) {
        require(users[msg.sender].currentRole == role, "Not permitted");
        _;
    }

    function authUser(string memory username, string memory secret)
        public
        view
        returns (bool)
    {
        return
            keccak256(abi.encodePacked(secret)) ==
            users[userLogins[username]].secretHash;
    }

    function newUser(
        address addr,
        string memory username,
        string memory fullName,
        bytes32 secretHash
    ) public {
        require(!users[addr].exists, "Already exists");

        uint32[] memory empty;

        userLoginsArray.push(username);
        userLogins[username] = addr;
        users[addr] = User(
            true,
            username,
            "",
            fullName,
            secretHash,
            Role.BUYER,
            Role.BUYER,
            empty,
            empty
        );
    }

    function getUser(address userAddr)
        public
        view
        returns (
            bool exists,
            address addr,
            string memory username,
            string memory fullName,
            string memory shop,
            Role currentRole,
            Role maxRole,
            uint32[] memory reviews
        )
    {
        User memory user = users[addr];

        return (
            user.exists,
            addr,
            user.username,
            user.fullName,
            user.shop,
            user.currentRole,
            user.maxRole,
            user.reviews
        );
    }

    function getUserAddress(string memory login)
        public
        view
        returns (address addr)
    {
        return userLogins[login];
    }

    function newShop(
        address addr,
        string memory city,
        bytes32 secretHash
    ) public requireRole(Role.ADMIN) {
        newUser(addr, city, concatStrings(city, "Shop"), secretHash);

        users[addr].maxRole = Role.SHOP;
        users[addr].currentRole = Role.SHOP;
        users[addr].shop = city;

        string[] memory emptyString;
        uint32[] memory emptyUint;

        shopCities.push(city);
        shops[city] = Shop(true, city, addr, emptyString, emptyUint, emptyUint);
    }

    function getShop(string memory shopCity)
        public
        view
        returns (
            bool exists,
            string memory city,
            address owner,
            string[] memory cashiers,
            uint32[] memory reviews
        )
    {
        Shop memory shop = shops[shopCity];

        return (
            shop.exists,
            shop.city,
            shop.owner,
            shop.cashiers,
            shop.reviews
        );
    }

    /*
    function getShopCityByOwner(address ownerAddr) public view returns (bool, string memory) {
        return (users[ownerAddr].role == Role.SHOP, users[ownerAddr].shop);
    }
*/
    function newReview(
        string memory shop,
        string memory content,
        uint8 rate,
        uint32 parent
    ) public {
        require(shops[shop].exists, "Shop doesn't exist");
        require(users[msg.sender].currentRole == Role.BUYER, "Not permitted");

        uint32 id = uint32(reviewIds.length);
        reviewIds.push(id);

        uint32[] memory emptyUint;
        address[] memory emptyAddress;
        reviews[id] = Review(
            true,
            msg.sender,
            content,
            shop,
            rate,
            parent,
            emptyUint,
            emptyAddress,
            emptyAddress
        );

        if (parent != 0) {
            shops[shop].reviews.push(id);
        } else {
            reviews[parent].children.push(id);
        }
    }

    function getReview(uint32 id)
        public
        view
        returns (
            bool exists,
            address author,
            string memory content,
            string memory shop,
            uint32 parent,
            uint8 rate,
            uint32[] memory children,
            uint32 rating
        )
    {
        Review memory review = reviews[id];

        uint32 reviewRating = uint32(review.likes.length) -
            uint32(review.dislikes.length);
        return (
            review.exists,
            review.author,
            review.content,
            review.shop,
            review.parent,
            review.rate,
            review.children,
            reviewRating
        );
    }

    function getShopReviews(string memory city)
        public
        view
        returns (uint32[] memory)
    {
        return shops[city].reviews;
    }

    function changeRole(
        address addr,
        Role role,
        string memory shop,
        bool max
    ) public {
        if (max) {
            require(
                users[msg.sender].currentRole == Role.ADMIN,
                "Not permitted"
            );

            users[addr].maxRole = role;
        } else {
            require(addr == msg.sender, "Not permitted");
            require(users[addr].maxRole >= role, "Not permitted");
        }

        if (max && role == Role.CASHIER) {
            require(shops[shop].exists, "Shop does not exist");
            users[addr].shop = shop;
        }

        users[addr].currentRole = role;
    }

    function newElevateRequest(Role role, string memory shop) public {
        if (role == Role.CASHIER) {
            require(shops[shop].exists, "Shop does not exist");
        }

        uint32 id = uint32(elevRequestIds.length);
        elevRequestIds.push(id);
        elevRequests[id] = ElevateRequest(true, msg.sender, shop, role);
        users[msg.sender].elevRequests.push(id);
    }

    function getElevateRequests()
        public
        view
        requireRole(Role.ADMIN)
        returns (uint32[] memory)
    {
        return elevRequestIds;
    }

    function operateElevateRequest(uint32 id, bool accept)
        public
        requireRole(Role.ADMIN)
    {
        ElevateRequest memory req = elevRequests[id];
        if (accept) {
            changeRole(req.author, req.role, req.shop, true);
        }
        elevRequests[id].exists = false;
    }

    function newCashRequest(uint256 value) public requireRole(Role.SHOP) {
        uint32 id = uint32(cashRequestIds.length);

        cashRequestIds.push(id);
        cashRequests[id] = CashRequest(
            true,
            users[msg.sender].shop,
            payable(msg.sender),
            value
        );
        shops[users[msg.sender].shop].cashRequests.push(id);
    }

    function getSelfCashRequests()
        public
        view
        requireRole(Role.SHOP)
        returns (uint32[] memory)
    {
        return shops[users[msg.sender].shop].cashRequests;
    }

    function concatStrings(string memory first, string memory second)
        private
        pure
        returns (string memory)
    {
        return string(abi.encodePacked(first, second));
    }
}
