// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

interface ShopManagerI {
    function logIn(string memory login, string memory password, string memory secret) external;
    function newUser() external;
    function getUser() external;
    function getUserLogin() external;
    function elevateUser() external;
    function newShop() external;
    function newReview() external;
    function getReviewsOfShop() external;
    function getShop() external;
    function getShops() external;
    function compareStrings() external;
    function compareKeccak() external;
}

contract ShopManager {
    address payable constant bank = payable(0x2637CdFF6A119fE306e2ac33E1f7dFB785eB75cc);
    address constant nullAddress = address(0);
    uint8 constant noRole = 10;
    
        struct User {
        string login;
        string name;
        string surname;
        string middlename;
        bytes32 pwHash;
        bytes32 secretHash;
        uint8 role; // 3 - банк, 2 - админ, 1 - продавец, 0 - покупатель, 
        address shop; // адрес магазина для продавцов, для покупателей равен нулю
        bool exists;
    }
    mapping(address => User) users;
    mapping(string => address) logins;
    string[] loginsArray;

    struct Review {
        address author;
        address reciever;
        uint32 answer;
        string content; // содержимое отзыва
        uint8 rate; // оценка от 1 до 10
        address[] likes;
        address[] dislikes;
        uint32[] answers;
        bool exists;
    }
    mapping(uint32 => Review) reviews;
    uint32[] reviewsArray;
    
    struct MoneyRequest {
        address author;
        uint requiredSum;
        bool exists;
    }
    mapping(address => MoneyRequest) moneyReqs;
    address[] moneyReqsArray;
    
    struct ElevateRequest {
        address author;
        uint8 requiredRole;
        address shop;
        bool exists;
    }
    mapping(address => ElevateRequest) elevateReqs;
    address[] elevateReqsArray;

    struct Shop {
        string city;
        address[] cashiers;
        uint32[] reviews;
        bool exists;
    }
    mapping(address => Shop) shops;
    mapping(string => address) shopCitites;
    string[] shopCititesArray;
    
    constructor() {
        address[] memory emptyCashiersArray;
        uint32[] memory emptyReviewsArray;
        shops[0x111fccf24f5511F35f891EABd5f2565AA2A1EcbE] = Shop("Dmitrov", emptyCashiersArray, emptyReviewsArray, true);
        shopCititesArray.push("Dmitrov");
        shopCitites["Dmitrov"] = 0x111fccf24f5511F35f891EABd5f2565AA2A1EcbE;
        
        shops[0xff0670496dE6c3062243ef20AbC6A520112B0C83] = Shop("Kaluga", emptyCashiersArray, emptyReviewsArray, true);
        shopCititesArray.push("Moscow");
        shopCitites["Moscow"] = 0xff0670496dE6c3062243ef20AbC6A520112B0C83;
        
        shops[0x8565A5f096759748F7968f9C456534567fC553CD] = Shop("Moscow", emptyCashiersArray, emptyReviewsArray, true);
        shopCititesArray.push("Moscow");
        shopCitites["Moscow"] = 0x8565A5f096759748F7968f9C456534567fC553CD;
        
        shops[0x8fe3a9A474a1334DE31E38793218168631B16E3a] = Shop("Ryazan", emptyCashiersArray, emptyReviewsArray, true);
        shopCititesArray.push("Ryazan");
        shopCitites["Ryazan"] = 0x8fe3a9A474a1334DE31E38793218168631B16E3a;
        
        shops[0x4F2BDBaA78a4f5AfA7A4F211f1BA01846C36b659] = Shop("Samara", emptyCashiersArray, emptyReviewsArray, true);
        shopCititesArray.push("Samara");
        shopCitites["Samara"] = 0x4F2BDBaA78a4f5AfA7A4F211f1BA01846C36b659;
        
        shops[0xcB1390F8AA35Cc779F00B4D8A30016d4BB3F9612] = Shop("Saint Petersburg", emptyCashiersArray, emptyReviewsArray, true);
        shopCititesArray.push("Saint Petersburg");
        shopCitites["Saint Petersburg"] = 0xcB1390F8AA35Cc779F00B4D8A30016d4BB3F9612;
        
        shops[0x8F3cc1af55855497c95d7D599167Aef2e166Ac91] = Shop("Taganrog", emptyCashiersArray, emptyReviewsArray, true);
        shopCititesArray.push("Taganrog");
        shopCitites["Taganrog"] = 0x8F3cc1af55855497c95d7D599167Aef2e166Ac91;
        
        shops[0x608aa250204CC08dE042bAD9461B22EBBF476Edd] = Shop("Tomsk", emptyCashiersArray, emptyReviewsArray, true);
        shopCititesArray.push("Tomsk");
        shopCitites["Tomsk"] = 0x608aa250204CC08dE042bAD9461B22EBBF476Edd;
        
        shops[0x7ba4Aa1941F0f1BF86F2CdeD7B1fE0029a2DB192] = Shop("Habarovsk", emptyCashiersArray, emptyReviewsArray, true);
        shopCititesArray.push("Habarovsk");
        shopCitites["Habarovsk"] = 0x7ba4Aa1941F0f1BF86F2CdeD7B1fE0029a2DB192;
        
        users[0x6eD466516a4aff6791b66D316d7593c0f94731B1] = User("ivan", "Ivan", "Ivanov", "Ivanovich", 0xa03ab19b866fc585b5cb1812a2f63ca861e7e7643ee5d43fd7106b623725fd67, 0x7d4e3eec80026719639ed4dba68916eb94c7a49a053e05c8f9578fe4e5a3d7ea, 2, nullAddress, true);
        logins["ivan"] = 0x6eD466516a4aff6791b66D316d7593c0f94731B1;
        loginsArray.push("ivan");
        
        users[0x387a0f1610e71472E505b19fAa10F33f5E208C4C] = User("semen", "Semen", "Semenov", "Semenovich", 0xa03ab19b866fc585b5cb1812a2f63ca861e7e7643ee5d43fd7106b623725fd67, 0x7d4e3eec80026719639ed4dba68916eb94c7a49a053e05c8f9578fe4e5a3d7ea, 1, shopCitites["Dmitrov"], true);
        logins["semen"] = 0x387a0f1610e71472E505b19fAa10F33f5E208C4C;
        loginsArray.push("semen");
        shops[shopCitites["Dmitrov"]].cashiers.push(logins["semen"]);
        
        users[0xAF4F5687aFe991A1ef5417a4b40A25745f94a9c1] = User("petr", "Petr", "Petrov", "Petrovich", 0xa03ab19b866fc585b5cb1812a2f63ca861e7e7643ee5d43fd7106b623725fd67, 0x7d4e3eec80026719639ed4dba68916eb94c7a49a053e05c8f9578fe4e5a3d7ea, 0, nullAddress, true);
        logins["petr"] = 0xAF4F5687aFe991A1ef5417a4b40A25745f94a9c1;
        loginsArray.push("petr");
    }

    modifier requireRole(uint8 role1, uint8 role2) {
        require(
            users[msg.sender].role == role1 || users[msg.sender].role == role2,
            "You're not permitted to use this operation!"
        );
        _;
    }

    function logIn(
        string memory login,
        string memory password,
        string memory secret
    ) public view returns (string memory) {
        User memory user = users[logins[login]];
        require(
            user.exists == false ||
                compareKeccak(password, user.pwHash) == false ||
                compareKeccak(secret, user.secretHash) == false,
            "Not authenticated"
        );

        return login;
    }

    function newUser(
        address addr,
        string memory login,
        string memory name,
        string memory surname,
        string memory middlename,
        bytes32 pwHash,
        bytes32 secretHash,
        uint8 role,
        string memory shop
    )
        public
    {
        require(users[addr].exists == false, "Such user already exists");
        if (role == 1) {
            require(
                compareStrings(shop, "") == false,
                "User is a cashier but shop is not specified"
            );
        }

        logins[login] = addr;
        loginsArray.push(login);
        users[addr] = User(
            login,
            name,
            surname,
            middlename,
            pwHash,
            secretHash,
            role,
            shopCitites[shop],
            true
        );
        //return (login, role, shop);
    }

    function getUser(string memory login)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            uint8,
            address,
            bool
        )
    {
        User memory user = users[logins[login]];
        return (
            user.login,
            user.name,
            user.surname,
            user.middlename,
            user.role,
            user.shop,
            user.exists
        );
    }

    function getUserLogin(address addr) public view returns (string memory) {
        return users[addr].login;
    }
    
    function moneyRequest(uint requiredSum) public {
        require(moneyReqs[msg.sender].exists == false, "You have already sent an money request to bank!");
        require(bank.balance >= requiredSum, "Bank does not have enough money for this request!");
        
        moneyReqs[msg.sender] = MoneyRequest(msg.sender, requiredSum, true);
        moneyReqsArray.push(msg.sender);
    }
    
    function getMoneyRequest(address sender) public view returns (bool exists, uint requiredSum) {
        return (moneyReqs[sender].exists, moneyReqs[sender].requiredSum);
    }
    
    function approveMoneyRequest(address payable sender) public payable requireRole(4, noRole) {
        MoneyRequest memory moneyReq = moneyReqs[sender];
        require(moneyReq.exists, "This shop didn't send any money requests!");
        sender.transfer(moneyReq.requiredSum);
        
        moneyReqs[sender] = MoneyRequest(nullAddress, 0, false);
        for(uint i = 0; i < moneyReqsArray.length; i++) {
            if(moneyReqsArray[i] == sender) {
                delete moneyReqsArray[i];
                break;
            }
        }
    }
    
    function getMoneyRequests() public view requireRole(4, noRole) returns (address[] memory addresses) {
        return moneyReqsArray;
    }
    
    function elevateRequest(uint8 requiredRole, string memory shop) public {
        require(elevateReqs[msg.sender].exists == false, "You already submitted elevate request!");
        if(requiredRole == 1) {
            require(shops[shopCitites[shop]].exists == true, "Required role is a cashier, but specified shop does not exist!");
        }
        elevateReqs[msg.sender] = ElevateRequest(msg.sender, requiredRole, shopCitites[shop], true);
        elevateReqsArray.push(msg.sender);
    }

    function elevateUser(
        bool isElevateRequest,
        string memory login,
        uint8 newRole,
        string memory shop
    ) public requireRole(2, noRole) {
        if(isElevateRequest) {
            ElevateRequest memory elevReq = elevateReqs[logins[login]];
            require(elevReq.exists == true, "This elevate request does not exist!");
            users[logins[login]].role = elevReq.requiredRole;
            users[logins[login]].shop = elevReq.shop;
            
            for(uint i = 0; i < elevateReqsArray.length; i++) {
                if(elevateReqsArray[i] == msg.sender) {
                    delete elevateReqsArray[i];
                    break;
                }
            }
        } else {
            users[logins[login]].role = newRole;
            users[logins[login]].shop = shopCitites[shop];
        }
    }

    function newShop(address addr, string memory city)
        public
        requireRole(2, noRole)
        returns (string memory, address)
    {
        require(
            shops[addr].exists == false &&
                shops[shopCitites[city]].exists == false,
            "Shop in this city already exists!"
        );

        address[] memory shopCashiers;
        uint32[] memory shopReviews;

        shopCitites[city] = addr;
        shops[addr] = Shop(city, shopCashiers, shopReviews, true);
        return (city, addr);
    }

    function newReview(
        address reciever,
        uint32 answer,
        string memory content,
        uint8 rate
    )
        public
        requireRole(0, 1)
        returns (
            address,
            address,
            uint32,
            string memory,
            uint8
        )
    {
        require(
            reviewsArray.length > answer || shops[reciever].exists,
            "Such user or shop does not exists!"
        );
        uint32 reviewId = uint32(reviewsArray.length);
        
        if(users[msg.sender].role == 1) {
            require(users[msg.sender].shop == reciever, "You can publish reviews only on your shop!");
            require(answer != 0, "You can only answer to reviews!");
        }

        address[] memory emptyAddressArray;
        uint32[] memory emptyUint32Array;
        
        if(answer != 0) {
            rate = 0;
        }

        reviewsArray.push(reviewId);
        reviews[reviewsArray[reviewId]] = Review(
            msg.sender,
            reciever,
            answer,
            content,
            rate,
            emptyAddressArray,
            emptyAddressArray,
            emptyUint32Array,
            true
        );
        return (msg.sender, reciever, answer, content, rate);
    }

    function getReviewsOfShop(address shopAddress)
        public
        view
        returns (uint32[] memory)
    {
        uint32[] memory result;

        for (uint32 i = 0; i < uint32(reviewsArray.length); i++) {
            Review memory review = reviews[reviewsArray[i]];
            if (review.reciever == shopAddress) {
                result[result.length] = i;
            }
        }

        return result;
    }

    function getShop(address addr)
        public
        view
        returns (
            address,
            string memory,
            address[] memory,
            uint32[] memory
        )
    {
        Shop memory shop;
        shop = shops[addr];

        return (shopCitites[shop.city], shop.city, shop.cashiers, shop.reviews);
    }
    
    function getShopAddress(string memory city) public view returns (address shopAddress) {
        return shopCitites[city];
    }
    
    function getShops() public view returns (address[] memory) {
        address[] memory result = new address[](shopCititesArray.length);
        
        for(uint i = 0; i < shopCititesArray.length; i++) {
            result[i] = shopCitites[shopCititesArray[i]];
        }
        return result;
    }

    function compareStrings(string memory str1, string memory str2)
        private
        pure
        returns (bool)
    {
        return
            keccak256(abi.encodePacked(str1)) ==
            keccak256(abi.encodePacked(str2));
    }

    function compareKeccak(string memory origin, bytes32 hash)
        private
        pure
        returns (bool)
    {
        return keccak256(abi.encodePacked(origin)) == hash;
    }
}
