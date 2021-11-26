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
        payable(0x2641D38Ed882F3E2Ea5F45f922Cded9D72ad09f7);
    address constant nullAddress = address(0);

    // Структура пользователя
    struct User {
        string login;
        string fullName;
        bytes32 secretHash;
        Role maxRole;
        Role role; // 5 - администратор, 4 - банк, 3 - магазин, 2 - поставщик, 1 - продавец, 0 - покупатель
        string shop; // для продавцов и аккаунтов магазинов
        uint32[] reviews; // отзывы
        bool exists;
    }

    // Структура магазина
    struct Shop {
        string city;
        address owner; // Аккаунт владельца магазина
        address[] cashiers;
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
        string memory secret
    ) public view returns (bool success) {
        User memory user = users[userLogins[username]];

        require(user.exists, "User does not exist");
        require(
            keccak256(abi.encodePacked(secret)) == user.secretHash,
            "Wrong password or secret"
        );

        return true;
    }

    // Функция создания нового пользователя (по умолчанию покупатель)
    function newUser(
        address addr,
        string memory username,
        string memory fullName,
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
            secretHash,
            Role.BUYER,
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
            Role maxRole,
            string memory shop
        )
    {
        User memory user = users[addr];
        return (user.exists, user.login, user.fullName, user.role, user.maxRole, user.shop);
    }

    function getUserLogins() public view returns (string[] memory usernames) {
        return userLoginsArray;
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

    function getElevateRequests()
        public
        view
        onlyAdmin
        returns (address[] memory requesters)
    {
        return elevReqsArray;
    }

    function getElevateRequest(address sender)
        public
        view
        onlyAdmin
        returns (
            bool exists,
            Role requiredRole,
            string memory requiredShop
        )
    {
        return (
            elevReqs[sender].exists,
            elevReqs[sender].role,
            elevReqs[sender].shop
        );
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
    function approveElevationRequest(address requestAuthor, bool accept) public onlyAdmin {
        ElevateRequest memory elevReq = elevReqs[requestAuthor];
        if(!accept) {
            elevReqs[requestAuthor].exists = false;
            return;
        }

        require(
            elevReq.exists,
            "This user have not sent any elevation requests!"
        );

        this.changeRole(requestAuthor, elevReq.role, elevReq.shop, true);
    }

    // Сменить роль пользователя
    function changeRole(
        address user,
        Role requiredRole,
        string memory requiredShop,
        bool maxRole
    ) public {
        users[user].role = requiredRole;
        if (maxRole && users[msg.sender].role == Role.ADMIN) {
            users[user].role = requiredRole;
            users[user].maxRole = requiredRole;
            users[user].shop = requiredShop;
        }
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
        
        address[] memory emptyCashiers;
        shops[city] = Shop(city, owner, emptyCashiers, true);
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

        if (answer != 0) {
            reviews[answer].answers.push(reviewId);
        }

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

    //// КОНСТРУКТОР КОНТРАКТА
    constructor() {
        uint32[] memory emptyReviews;
        address[] memory emptyCashiers;
        bytes32 secretHash = keccak256(abi.encodePacked("12345"));

        /// Магазины
        // Дмитров
        users[0x45C16acB0b0a616994c5dbAc60C05E4453029093] = User(
            "dmitrov",
            "Dmitrov Shop",
            secretHash,
            Role.SHOP,
            Role.SHOP,
            "Dmitrov",
            emptyReviews,
            true
        );
        userLogins["dmitrov"] = 0x45C16acB0b0a616994c5dbAc60C05E4453029093;
        userLoginsArray.push("dmitrov");
        shops["Dmitrov"] = Shop(
            "Dmitrov",
            0x45C16acB0b0a616994c5dbAc60C05E4453029093,
            emptyCashiers,
            true
        );
        shopCitites.push("Dmitrov");

        // Калуга
        users[0xEd637709F4EDaC6A5008FB7405794e753A1Ead90] = User(
            "kaluga",
            "Kaluga Shop",
            secretHash,
            Role.SHOP,
            Role.SHOP,
            "Kaluga",
            emptyReviews,
            true
        );
        userLogins["kaluga"] = 0xEd637709F4EDaC6A5008FB7405794e753A1Ead90;
        userLoginsArray.push("kaluga");
        shops["Kaluga"] = Shop(
            "Kaluga",
            0xEd637709F4EDaC6A5008FB7405794e753A1Ead90,
            emptyCashiers,
            true
        );
        shopCitites.push("Kaluga");

        // Москва
        users[0x26280BC071E734EbbFBBa9EEeF0a7c2FaF1Ba4A5] = User(
            "moscow",
            "Moscow Shop",
            secretHash,
            Role.SHOP,
            Role.SHOP,
            "Moscow",
            emptyReviews,
            true
        );
        userLogins["moscow"] = 0x26280BC071E734EbbFBBa9EEeF0a7c2FaF1Ba4A5;
        userLoginsArray.push("moscow");
        shops["Moscow"] = Shop(
            "Moscow",
            0x26280BC071E734EbbFBBa9EEeF0a7c2FaF1Ba4A5,
            emptyCashiers,
            true
        );
        shopCitites.push("Moscow");

        // Рязань
        users[0xf3a7531B5991AeDeeAB93B43300Ea2be0f26DEd9] = User(
            "ryazan",
            "Ryazan Shop",
            secretHash,
            Role.SHOP,
            Role.SHOP,
            "Ryazan",
            emptyReviews,
            true
        );
        userLogins["ryazan"] = 0xf3a7531B5991AeDeeAB93B43300Ea2be0f26DEd9;
        userLoginsArray.push("ryazan");
        shops["Ryazan"] = Shop(
            "Ryazan",
            0xf3a7531B5991AeDeeAB93B43300Ea2be0f26DEd9,
            emptyCashiers,
            true
        );
        shopCitites.push("Ryazan");

        // Самара
        users[0x45483719e57a7b10C73e842aABf9B009D1fe2E32] = User(
            "samara",
            "Samara Shop",
            secretHash,
            Role.SHOP,
            Role.SHOP,
            "Samara",
            emptyReviews,
            true
        );
        userLogins["samara"] = 0x45483719e57a7b10C73e842aABf9B009D1fe2E32;
        userLoginsArray.push("samara");
        shops["Samara"] = Shop(
            "Samara",
            0x45483719e57a7b10C73e842aABf9B009D1fe2E32,
            emptyCashiers,
            true
        );
        shopCitites.push("Samara");

        // Санкт-Петербург
        users[0x1567f49dd576775d225D9C987880deE8e2e0e3DA] = User(
            "saint-petersburg",
            "Saint Petersburg Shop",
            secretHash,
            Role.SHOP,
            Role.SHOP,
            "Saint Petersburg",
            emptyReviews,
            true
        );
        userLogins[
            "saint-peterspurg"
        ] = 0x1567f49dd576775d225D9C987880deE8e2e0e3DA;
        userLoginsArray.push("saint-petersburg");
        shops["Saint Petersburg"] = Shop(
            "Saint Petersburg",
            0x1567f49dd576775d225D9C987880deE8e2e0e3DA,
            emptyCashiers,
            true
        );
        shopCitites.push("Saint Petersburg");

        // Таганрог
        users[0xA35cD8F38607cE823Ee307FfAF57F859762AecDc] = User(
            "taganrog",
            "Taganrog Shop",
            secretHash,
            Role.SHOP,
            Role.SHOP,
            "Taganrog",
            emptyReviews,
            true
        );
        userLogins["taganrog"] = 0xA35cD8F38607cE823Ee307FfAF57F859762AecDc;
        userLoginsArray.push("taganrog");
        shops["Taganrog"] = Shop(
            "Taganrog",
            0xA35cD8F38607cE823Ee307FfAF57F859762AecDc,
            emptyCashiers,
            true
        );
        shopCitites.push("Taganrog");

        // Томск
        users[0x6a052A062A54344363b67BaD3B3FAfD6220Ac333] = User(
            "tomsk",
            "Tomsk Shop",
            secretHash,
            Role.SHOP,
            Role.SHOP,
            "Tomsk",
            emptyReviews,
            true
        );
        userLogins["tomsk"] = 0x6a052A062A54344363b67BaD3B3FAfD6220Ac333;
        userLoginsArray.push("tomsk");
        shops["Tomsk"] = Shop(
            "Tomsk",
            0x6a052A062A54344363b67BaD3B3FAfD6220Ac333,
            emptyCashiers,
            true
        );
        shopCitites.push("Tomsk");

        // Хабаровск
        users[0x602E85A431e7cFB8489aFE0FF40EDa6C2B968afD] = User(
            "habarovsk",
            "Habarovsk Shop",
            secretHash,
            Role.SHOP,
            Role.SHOP,
            "Habarovsk",
            emptyReviews,
            true
        );
        userLogins["habarovsk"] = 0x602E85A431e7cFB8489aFE0FF40EDa6C2B968afD;
        userLoginsArray.push("habrovsk");
        shops["Habarovsk"] = Shop(
            "Habarovsk",
            0x602E85A431e7cFB8489aFE0FF40EDa6C2B968afD,
            emptyCashiers,
            true
        );
        shopCitites.push("Habarovsk");

        /// ПОЛЬЗОВАТЕЛИ
        // Банк
        users[0x2641D38Ed882F3E2Ea5F45f922Cded9D72ad09f7] = User(
            "bank",
            "Bank",
            secretHash,
            Role.BANK,
            Role.BANK,
            "",
            emptyReviews,
            true
        );
        userLogins["bank"] = 0x2641D38Ed882F3E2Ea5F45f922Cded9D72ad09f7;
        userLoginsArray.push("bank");

        // Поставщик
        users[0x8a3e473eeDab5Ff476A4d9E2EeEE289d1feBC7b3] = User(
            "goldfish",
            "Gold Fish",
            secretHash,
            Role.PROVIDER,
            Role.PROVIDER,
            "",
            emptyReviews,
            true
        );
        userLogins["goldfish"] = 0x8a3e473eeDab5Ff476A4d9E2EeEE289d1feBC7b3;
        userLoginsArray.push("goldfish");

        // Администратор
        users[0xBC03ee8CDE310F36F2a6f04C9965Caeb11bA315a] = User(
            "admin",
            "Ivanov Ivan Ivanovich",
            secretHash,
            Role.ADMIN,
            Role.ADMIN,
            "",
            emptyReviews,
            true
        );
        userLogins["admin"] = 0xBC03ee8CDE310F36F2a6f04C9965Caeb11bA315a;
        userLoginsArray.push("admin");

        // Продавец
        users[0xDD28c05343B9D59F922202918C0f8c4802Be312f] = User(
            "semen",
            "Semenov Semen Semenovich",
            secretHash,
            Role.CASHIER,
            Role.CASHIER,
            "Dmitrov",
            emptyReviews,
            true
        );
        userLogins["semen"] = 0xDD28c05343B9D59F922202918C0f8c4802Be312f;
        userLoginsArray.push("semen");

        // Покупатель
        users[0xB7e3fFc2f94cE0a3ccFc599270d8023d8Ab9cac6] = User(
            "petr",
            "Petrov Petr Petrovich",
            secretHash,
            Role.BUYER,
            Role.BUYER,
            "",
            emptyReviews,
            true
        );
        userLogins["petr"] = 0xB7e3fFc2f94cE0a3ccFc599270d8023d8Ab9cac6;
        userLoginsArray.push("petr");
    }
}
