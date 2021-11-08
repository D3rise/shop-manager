// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

contract ShopManager {
    address constant bank = 0x2637CdFF6A119fE306e2ac33E1f7dFB785eB75cc;
    address constant nullAddress = address(0);

    event ReturnShop(
        address addr,
        string city,
        address[] cashiers,
        uint32[] reviews
    );
    event NewShop(string city, address addr);

    event NewReview(
        address author,
        address reciever,
        uint32 answer,
        string content,
        uint8 rate
    );
    event ReturnReview(
        address author,
        address reciever,
        uint32 answer,
        string content,
        uint8 rate,
        address[] likes,
        address[] dislikes,
        uint32[] answers
    );

    event NewUser(string login, uint8 role, string shop);
    event UserAuthorized(string login);
    event UserNotAuthorized(string login);
    event ReturnUser(
        string login,
        string name,
        string surname,
        string middlename,
        uint8 role,
        string shop
    );
    event ElevateUser(string login, uint8 newRole);

    struct User {
        string login;
        string name;
        string surname;
        string middlename;
        bytes32 pwHash;
        bytes32 secretHash;
        uint8 role; // 2 - админ, 1 - продавец, 0 - покупатель
        string shop; // адрес магазина для продавцов, для покупателей равен нулю
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
        uint8 rate; // 0 - отрицательный отзыв, 1 - положительный
        address[] likes;
        address[] dislikes;
        uint32[] answers;
        bool exists;
    }
    mapping(uint32 => Review) reviews;
    uint32[] reviewsArray;

    struct Shop {
        string city;
        address[] cashiers;
        uint32[] reviews;
        bool exists;
    }
    mapping(address => Shop) shops;
    mapping(string => address) shopCitites;
    string[] shopCititesArray;

    modifier requireRole(uint8 role) {
        require(
            users[msg.sender].role == role,
            "You're not permitted to use this operation!"
        );
        _;
    }

    function logIn(
        string memory login,
        string memory password,
        string memory secret
    ) public {
        User memory user = users[logins[login]];

        if (
            user.exists == false ||
            compareKeccak(password, user.pwHash) == false ||
            compareKeccak(secret, user.secretHash)
        ) {
            emit UserNotAuthorized(login);
            return;
        }

        emit UserAuthorized(login);
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
    ) public {
        require(users[addr].exists, "Such user already exists");
        require(
            role == 1 && !compareStrings(shop, ""),
            "User is a cashier but shop is not specified"
        );

        users[addr] = User(
            login,
            name,
            surname,
            middlename,
            pwHash,
            secretHash,
            role,
            shop,
            true
        );
        emit NewUser(login, role, shop);
    }

    function getUser(string memory login) public {
        User memory user = users[logins[login]];
        emit ReturnUser(
            user.login,
            user.name,
            user.surname,
            user.middlename,
            user.role,
            user.shop
        );
    }

    function elevateUser(
        string memory login,
        uint8 newRole,
        string memory shop
    ) public requireRole(2) {
        users[logins[login]].role = newRole;
        users[logins[login]].shop = shop;

        emit ElevateUser(login, newRole);
    }

    function newShop(address addr, string memory city) public requireRole(2) {
        require(
            shops[addr].exists == false &&
                shops[shopCitites[city]].exists == false,
            "Shop in this city already exists!"
        );

        address[] memory shopCashiers;
        uint32[] memory shopReviews;

        shopCitites[city] = addr;
        shops[addr] = Shop(city, shopCashiers, shopReviews, true);
        emit NewShop(city, addr);
    }

    function newReview(
        address reciever,
        uint32 answer,
        string memory content,
        uint8 rate
    ) public requireRole(0) requireRole(1) {
        require(
            reviewsArray.length > answer || shops[reciever].exists,
            "Such user or shop does not exists!"
        );
        uint32 reviewId = uint32(reviewsArray.length);

        address[] memory likes;
        address[] memory dislikes;
        uint32[] memory answers;

        reviewsArray[reviewsArray.length] = reviewId;
        reviews[reviewsArray[reviewId]] = Review(
            msg.sender,
            reciever,
            answer,
            content,
            rate,
            likes,
            dislikes,
            answers,
            true
        );
        emit NewReview(msg.sender, reciever, answer, content, rate);
    }

    function getReviewsOfShop(address shopAddress) public {
        for (uint32 i = 0; i < uint32(reviewsArray.length); i++) {
            Review memory review = reviews[reviewsArray[i]];
            if (review.reciever == shopAddress) {
                emit ReturnReview(
                    review.author,
                    shopAddress,
                    review.answer,
                    review.content,
                    review.rate,
                    review.likes,
                    review.dislikes,
                    review.answers
                );
            }
        }
    }

    function getUser(address addr, string memory login) public {
        User memory user;

        if (compareStrings(login, "")) {
            user = users[addr];
        } else {
            user = users[logins[login]];
        }

        emit ReturnUser(
            user.login,
            user.name,
            user.surname,
            user.middlename,
            user.role,
            user.shop
        );
    }

    function getShop(address addr, string memory city) public {
        Shop memory shop;

        if (compareStrings(city, "")) {
            shop = shops[addr];
        } else {
            shop = shops[shopCitites[city]];
        }

        emit ReturnShop(
            shopCitites[shop.city],
            shop.city,
            shop.cashiers,
            shop.reviews
        );
    }

    function compareStrings(string memory str1, string memory str2)
        private
        pure
        returns (bool)
    {
        return
            keccak256(abi.encodePacked(str1)) !=
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
