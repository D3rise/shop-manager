// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

contract ShopManager {
    enum Role {
        BUYER,
        CASHIER,
        PROVIDER,
        SHOP,
        BANK,
        ADMIN
    }

    string constant notPermittedError =
        "You are not permitted to execute this operation";

    address payable constant bank =
        payable(0x2637CdFF6A119fE306e2ac33E1f7dFB785eB75cc);
    address constant nullAddress = address(0);

    // Структура пользователя
    struct User {
        string login;
        string fullName;
        bytes32 pwHash;
        bytes32 secretHash;
        Role role; // 5 - администратор, 4 - банк, 3 - магазин, 2 - поставщик, 1 - продавец, 0 - покупатель
        string shop; // для продавцов и аккаунтов магазинов
        uint32[] reviews; // отзывы
        bool exists;
    }

    // Структура магазина
    struct Shop {
        string city;
        address owner; // Аккаунт владельца магазина
        bool exists;
    }

    // Структура отзыва
    struct Review {
        address sender;
        string shop;
        string content;
        uint32 answer;
        uint32[] answers;
        uint8 rate;
        address[] likes;
        address[] dislikes;
        bool exists;
    }

    // Структура запроса денег
    struct MoneyRequest {
        address sender; // адрес отправителя запроса (владелец магазина)
        uint256 count; // Требуемая суммая денег
        bool exists;
    }

    // Структура запроса на повышение/понижение
    struct ElevateRequest {
        address sender; // Отправитель запроса (пользователь)
        Role role;
        string shop; // при повышении до продавца нужно указать требуемый магазин
        bool exists;
    }

    /// Маппинги и массивы для работы со всеми структурами
    // Пользователи
    mapping(address => User) users;
    mapping(string => address) userLogins;
    string[] userLoginsArray;

    // Магазины по городам
    mapping(string => Shop) shops;
    string[] shopCitites;

    // Отзывы по идентификаторам
    mapping(uint32 => Review) reviews;
    uint32[] reviewsArray = [0]; // нулевой отзыв - отсутствие отзыва, для ответов

    // Запросы на смену роли по пользователям
    mapping(address => ElevateRequest) elevReqs;
    address[] elevReqsArray;

    // Запросы денег по магазинам
    mapping(string => MoneyRequest) moneyReqs;
    string[] moneyReqsArray;

    //// МОДИФИКАТОРЫ
    // Модификатор требования роли
    modifier onlyAdmin() {
        require(users[msg.sender].role == Role.ADMIN, notPermittedError);
        _;
    }

    modifier onlyBank() {
        require(users[msg.sender].role == Role.BANK, notPermittedError);
        _;
    }

    modifier onlyBuyersAndCashiers() {
        User memory user = users[msg.sender];
        require(
            user.role == Role.BUYER || user.role == Role.CASHIER,
            notPermittedError
        );
        _;
    }

    modifier onlyShopOwner() {
        require(users[msg.sender].role == Role.SHOP, notPermittedError);
        _;
    }

    modifier cashierRoleChangeChecks(
        Role requiredRole,
        string memory requiredShop
    ) {
        if (requiredRole == Role.CASHIER) {
            require(
                !compareStrings(requiredShop, ""),
                "Required role is cashier, but required shop is not specified"
            );

            require(shops[requiredShop].exists, "There is no such shop");
        }
        _;
    }

    //// ФУНКЦИИ ПОЛЬЗОВАТЕЛЕЙ
    // Функция входа в аккаунт
    function authenticateUser(
        string memory username,
        string memory password,
        string memory secret
    ) public view returns (string memory loginAuthenticated) {
        User memory user = users[userLogins[username]];

        require(user.exists, "User does not exist");
        require(
            compareKeccak(password, user.pwHash) == true &&
                compareKeccak(secret, user.secretHash),
            "Wrong password or secret"
        );

        return username;
    }

    // Функция создания нового пользователя (по умолчанию покупатель)
    function newUser(
        address addr,
        string memory username,
        string memory fullName,
        bytes32 pwHash,
        bytes32 secretHash
    ) public {
        require(
            !users[addr].exists && !users[userLogins[username]].exists,
            "User already exist"
        );

        uint32[] memory emptyReviewsArray;

        userLoginsArray.push(username);
        userLogins[username] = addr;
        users[addr] = User(
            username,
            fullName,
            pwHash,
            secretHash,
            Role.BUYER,
            "",
            emptyReviewsArray,
            true
        );
    }

    // Функция получения адреса пользователя
    function getUserAddress(string memory login)
        public
        view
        returns (address userAddress)
    {
        return userLogins[login];
    }

    // Функция получения пользователя по адресу
    function getUser(address addr)
        public
        view
        returns (
            bool exists,
            string memory username,
            string memory fullName,
            Role role,
            string memory shop
        )
    {
        User memory user = users[addr];
        return (user.exists, user.login, user.fullName, user.role, user.shop);
    }

    // Функция запроса на смену роли
    function newElevateRequest(Role requiredRole, string memory requiredShop)
        public
        onlyBuyersAndCashiers
        cashierRoleChangeChecks(requiredRole, requiredShop)
    {
        require(
            !elevReqs[msg.sender].exists,
            "You have already sent an elevate request!"
        );

        elevReqs[msg.sender] = ElevateRequest(
            msg.sender,
            requiredRole,
            requiredShop,
            true
        );
        elevReqsArray.push(msg.sender);
    }

    // Функция отмены запроса на смену роли
    function cancelElevationRequest() public onlyBuyersAndCashiers {
        require(
            elevReqs[msg.sender].exists,
            "You have not sent any elevate requests!"
        );

        elevReqs[msg.sender].exists = false;
        for (uint256 i = 0; i < elevReqsArray.length; i++) {
            if (elevReqsArray[i] == msg.sender) {
                delete elevReqsArray[i];
            }
        }
    }

    // Подтвердить запрос на смену роли
    function approveElevationRequest(address requestAuthor) public onlyAdmin {
        ElevateRequest memory elevReq = elevReqs[requestAuthor];

        require(
            elevReq.exists,
            "This user have not sent any elevation requests!"
        );

        this.changeRole(requestAuthor, elevReq.role, elevReq.shop);
    }

    // Сменить роль пользователя
    function changeRole(
        address user,
        Role requiredRole,
        string memory requiredShop
    ) public onlyAdmin cashierRoleChangeChecks(requiredRole, requiredShop) {
        users[user].role = requiredRole;
        users[user].shop = requiredShop;
    }

    //// ФУНКЦИИ МАГАЗИНОВ
    // Создать новый магазин
    function newShop(string memory city, address owner) public onlyAdmin {
        require(users[owner].exists, "Owner does not exist");
        require(
            shops[city].exists == false,
            "There is already shop in this city"
        );

        shopCitites.push(city);
        shops[city] = Shop(city, owner, true);
        users[owner].role = Role.SHOP;
        users[owner].shop = city;
    }

    // Функция удаления магазина
    function deleteShop(string memory city) public onlyAdmin {
        Shop memory shop = shops[city];

        require(shop.exists, "There is no shop in this city");
        for (uint256 i = 0; i < userLoginsArray.length; i++) {
            address userAddress = userLogins[userLoginsArray[i]];
            User memory user = users[userLogins[userLoginsArray[i]]];
            if (user.role == Role.CASHIER) {
                users[userAddress].role = Role.BUYER;
            }
        }

        users[shop.owner].role = Role.BUYER;
        users[shop.owner].shop = "";
        deleteMoneyRequest(city);
    }

    // Получить список магазинов
    function getShops() public view returns (string[] memory shopCities) {
        return shopCitites;
    }

    // Получить информацию о магазине по городу
    function getShopByCity(string memory city)
        public
        view
        returns (
            bool exists,
            string memory shopCity,
            address shopOwner
        )
    {
        return (shops[city].exists, shops[city].city, shops[city].owner);
    }

    // Получить информацию о магазине по адресу владельца
    function getShopByOwnerAddress(address owner)
        public
        view
        returns (
            bool exists,
            string memory shopCity,
            address shopOwner
        )
    {
        string memory shop = users[owner].shop;
        return this.getShopByCity(shop);
    }

    //// ФУНКЦИИ ОТЗЫВОВ
    // Получить отзывы о магазине
    function getShopReviews(string memory city)
        public
        view
        returns (uint32[] memory reviewIds)
    {
        uint32 count;
        uint32[] memory rawReviews = new uint32[](reviewsArray.length);
        for (uint256 i = 0; i < reviewsArray.length; i++) {
            if (compareStrings(reviews[reviewsArray[i]].shop, city)) {
                rawReviews[count] = reviewsArray[i];
                count++;
            }
        }

        reviewIds = new uint32[](count);
        for (uint256 i = 0; i < count; i++) {
            reviewIds[i] = rawReviews[i];
        }
        return reviewIds;
    }

    // Функция получения отзывов пользователя
    function getUserReviews(address userAddress)
        public
        view
        returns (bool exists, uint32[] memory reviewIds)
    {
        return (users[userAddress].exists, users[userAddress].reviews);
    }

    // Функция получения отзыва
    function getReview(uint32 reviewId)
        public
        view
        returns (
            bool exists,
            address sender,
            string memory shop,
            string memory content,
            uint32 answer,
            uint32[] memory answers,
            uint8 rate,
            address[] memory likes,
            address[] memory dislikes
        )
    {
        Review memory review = reviews[reviewId];
        return (
            review.exists,
            review.sender,
            review.shop,
            review.content,
            review.answer,
            review.answers,
            review.rate,
            review.likes,
            review.dislikes
        );
    }

    // Функция публикации отзыва
    function newReview(
        string memory shop,
        string memory content,
        uint8 rate,
        uint32 answer
    ) public onlyBuyersAndCashiers {
        User memory sender = users[msg.sender];

        require(shops[shop].exists, "Shop does not exist");
        if (sender.role == Role.CASHIER) {
            require(
                compareStrings(shop, sender.shop),
                "You can publish reviews only on your shop!"
            );
            require(answer != 0, "You can only send answers!");
        } else {
            require(
                rate >= 1 && rate <= 10,
                "Rate can only be between 1 and 10"
            );
        }

        uint32 reviewId = uint32(reviewsArray.length);
        reviewsArray.push(reviewId);

        uint32[] memory emptyReviews;
        address[] memory emptyAddresses;
        reviews[reviewId] = Review(
            msg.sender,
            shop,
            content,
            answer,
            emptyReviews,
            sender.role == Role.CASHIER ? 0 : rate,
            emptyAddresses,
            emptyAddresses,
            true
        );

        users[msg.sender].reviews.push(reviewId);
    }

    // Оценить отзыв (поставить лайк/дизлайк)
    function rateReview(uint32 review, bool positive)
        public
        onlyBuyersAndCashiers
    {
        Review memory currentReview = reviews[review];
        require(currentReview.exists, "This review does not exist");
        require(
            currentReview.sender != msg.sender,
            "You can't rate your own review"
        );

        deleteRateFromReview(review);

        if (positive) {
            reviews[review].likes.push(msg.sender);
        } else {
            reviews[review].dislikes.push(msg.sender);
        }
    }

    function deleteRateFromReview(uint32 review) private returns (bool) {
        Review memory currentReview = reviews[review];

        for (uint256 i = 0; i < currentReview.likes.length; i++) {
            if (currentReview.likes[i] == msg.sender) {
                delete reviews[review].likes[i];
                return true;
            }
        }

        for (uint256 i = 0; i < currentReview.dislikes.length; i++) {
            if (currentReview.dislikes[i] == msg.sender) {
                delete reviews[review].dislikes[i];
                return true;
            }
        }
        return false;
    }

    //// ФУНКЦИИ БАНКА
    // Запрос средств от имени магазина
    function newMoneyRequest(uint256 requiredSum) public onlyShopOwner {
        Shop memory shop = shops[users[msg.sender].shop];
        require(
            !moneyReqs[shop.city].exists,
            "You have already sent an money request"
        );

        require(
            requiredSum <= bank.balance,
            "Bank does not have enough money to satisfy your request"
        );

        moneyReqs[shop.city] = MoneyRequest(msg.sender, requiredSum, true);
        moneyReqsArray.push(shop.city);
    }

    // Получить массив всех запросов денег
    function getMoneyRequests()
        public
        view
        onlyBank
        returns (string[] memory moneyRequesters)
    {
        return moneyReqsArray;
    }

    // Получить информацию о запросе денег
    function getMoneyRequest(string memory shopCity)
        public
        view
        onlyBank
        returns (
            bool exists,
            address sender,
            uint256 count
        )
    {
        MoneyRequest memory moneyReq = moneyReqs[shopCity];
        return (moneyReq.exists, moneyReq.sender, moneyReq.count);
    }

    // Отмена запроса денег
    function cancelMoneyRequest() public onlyShopOwner {
        Shop memory shop = shops[users[msg.sender].shop];
        require(
            moneyReqs[shop.city].exists,
            "You haven't sent any money request"
        );

        deleteMoneyRequest(shop.city);
    }

    // Удовлетворить запрос денег
    function approveMoneyRequest(string memory shopCity)
        public
        payable
        onlyBank
    {
        MoneyRequest memory moneyReq = moneyReqs[shopCity];
        require(moneyReq.exists, "This shop didn't sent any money requests");
        require(
            msg.value == moneyReq.count,
            "You need to send exact same amount of money that is written in money request"
        );

        address payable ownerAddress = payable(shops[shopCity].owner);
        ownerAddress.transfer(moneyReq.count);

        deleteMoneyRequest(shopCity);
    }

    // Удалить запрос денег
    function deleteMoneyRequest(string memory shopCity) private returns (bool) {
        moneyReqs[shopCity].exists = false;
        for (uint256 i = 0; i < moneyReqsArray.length; i++) {
            if (compareStrings(moneyReqsArray[i], shopCity)) {
                delete moneyReqsArray[i];
                return true;
            }
        }
        return false;
    }

    //// УТИЛИТЫ
    // Сравнить строки
    function compareStrings(string memory str1, string memory str2)
        private
        pure
        returns (bool)
    {
        return
            keccak256(abi.encodePacked(str1)) ==
            keccak256(abi.encodePacked(str2));
    }

    // Сравнить хеши
    function compareKeccak(string memory origin, bytes32 hash)
        private
        pure
        returns (bool)
    {
        return keccak256(abi.encodePacked(origin)) == hash;
    }
}
