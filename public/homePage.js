'use strict'

//выход из профиля
const logoutButton = new LogoutButton();
logoutButton.action = logout => {
  console.log('логаут');
  ApiConnector.logout(
      logoutCheck => {
        console.log(logoutCheck);
        if (logoutCheck.success === true) {
          console.log("Деавторизация успешна. Возврат к странице авторизации");
          location.reload();
        } else {
          console.log(logoutCheck.data);
          location.reload();
        }
});
}

//обновление информации о профиле
function refreshUserData() {
    ApiConnector.current(currentUser => {
    console.log(currentUser);
    if(currentUser.success === true) {
        ProfileWidget.showProfile(currentUser.data);
    } else {
        console.log("Пользователь не найден");
    };
    });
}

refreshUserData();

//получение курсов валют
const ratesBoard = new RatesBoard;

function getRatesBoard() {
    ApiConnector.getStocks(stocks => {
        console.log(stocks);
        if (stocks.success === true) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(stocks.data);
        } else {
            console.log("Не получены данные от сервера");
        };
    })
}

getRatesBoard();
setInterval(getRatesBoard, 60000);

//операции со счетом
const moneyManager = new MoneyManager;

//пополнение счета
moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, response => {
        console.log(response.data);
        if (response.success === true) {
        console.log(`баланс увеличен на ${data.amount} ${data.currency}`);
        moneyManager.setMessage(false, `баланс увеличен на ${data.amount} ${data.currency}`);
        } else {
            moneyManager.setMessage(true, "Операция не выполнена"); //добавить расширенное описание ошибок
        }

    });
    
    setTimeout(refreshUserData, 2000);
}

//конвертация валюты
moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, response => {
        console.log(response.data);
        if (response.success === true) {
        console.log(`выполнена конвертация ${data.fromAmount} ${data.fromCurrency} в ${data.targetCurrency}`);
        moneyManager.setMessage(false, `выполнена конвертация ${data.fromAmount} ${data.fromCurrency} в ${data.targetCurrency}`);
        } else {
            moneyManager.setMessage(true, "Операция не выполнена"); //добавить расширенное описание ошибок
        }
    });

    setTimeout(refreshUserData, 2000);
}

//перевод средств
moneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, response => {
        console.log(response.data);
        if (response.success === true) {
        console.log(`переведено ${data.amount} ${data.currency} пользователю ${data.to}`);
        moneyManager.setMessage(false, `переведено ${data.amount} ${data.currency} пользователю ${data.to}`);
        } else {
            moneyManager.setMessage(true, "Операция не выполнена"); //добавить расширенное описание ошибок
        }

    });
    
    setTimeout(refreshUserData, 2000);
}

//работа с избранным
const favoritesWidget = new FavoritesWidget;

//получение списка избранного
function getFavoritesList() {
    ApiConnector.getFavorites(favorites => {
      console.log(favorites);
      if (favorites.success === true) {
          favoritesWidget.clearTable();
          favoritesWidget.fillTable(favorites.data);
          moneyManager.updateUsersList(favorites.data);
                              
      } else {
          console.log("Не удалось загрузить список избранного");
      };
  });
}

getFavoritesList();

//добавление в список избранного
//как узнать, существует ли такой пользователь и верно ли указаны ID и имя??
favoritesWidget.addUserCallback = user => {
    ApiConnector.addUserToFavorites(user, response => {
        console.log(response);
        if (response.success === true) {
            console.log(`пользователь ID ${user.id} "${user.name}" добавлен в адресную книгу`);
            favoritesWidget.setMessage(false, `пользователь ID ${user.id} "${user.name}" добавлен в адресную книгу`);
        } else {
            favoritesWidget.setMessage(true, `${response.data}`); //добавить расширенное описание ошибок
            }
    });
    setTimeout(getFavoritesList(), 2000);
}

//удаление из списка избранного
favoritesWidget.removeUserCallback = user => {
    ApiConnector.removeUserFromFavorites(user, response => {
        console.log(response);
        if (response.success === true) {
            console.log(`пользователь ID ${user} удален из адресной книги`);
            favoritesWidget.setMessage(false, `пользователь ID ${user} удален из адресной книги`);
        } else {
            favoritesWidget.setMessage(true, `${response.data}`); //добавить расширенное описание ошибок
            }
    });
    setTimeout(getFavoritesList(), 2000);
}