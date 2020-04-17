'use strict'

//выход из профиля
const logoutButton = new LogoutButton();
logoutButton.action = logout => {
  ApiConnector.logout(
      logoutCheck => {
        if (logoutCheck.success) {
          location.reload();
    }
});
}

//обновление информации о профиле
ApiConnector.current(currentUser => {
    if(currentUser.success) {
        ProfileWidget.showProfile(currentUser.data);
    } else {
        console.log("Пользователь не найден");
    };
});


//получение курсов валют
const ratesBoard = new RatesBoard();

function getRatesBoard() {
    ApiConnector.getStocks(stocks => {
        if (stocks.success) {
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
const moneyManager = new MoneyManager();

//пополнение счета
moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, response => {
        if (response.success) {
            moneyManager.setMessage(false, `баланс увеличен на ${data.amount} ${data.currency}`);
            ProfileWidget.showProfile(response.data);
        } else {
            moneyManager.setMessage(true, response.data); 
        }

    });

}

//конвертация валюты
moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, response => {
        if (response.success) {
            moneyManager.setMessage(false, `выполнена конвертация ${data.fromAmount} ${data.fromCurrency} в ${data.targetCurrency}`);
            ProfileWidget.showProfile(response.data);
        } else {
            moneyManager.setMessage(true, response.data); 
        }
    });
}

//перевод средств
moneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, response => {
        if (response.success) {
        moneyManager.setMessage(false, `переведено ${data.amount} ${data.currency} пользователю ${data.to}`);
        ProfileWidget.showProfile(response.data);
        } else {
            moneyManager.setMessage(true, response.data);
        }

    });
}

//работа с избранным
const favoritesWidget = new FavoritesWidget();

//функция обновления списка избранного
function refreshFavoritesList(data) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(data);
    moneyManager.updateUsersList(data);
}

//получение списка избранного
function getFavoritesList() {
    ApiConnector.getFavorites(favorites => {
      if (favorites.success) {
        refreshFavoritesList(favorites.data);
                              
      } else {
        favoritesWidget.setMessage("Не удалось загрузить список избранного");
      };
  });
}

getFavoritesList();

//добавление в список избранного
//как узнать, существует ли такой пользователь и верно ли указаны ID и имя??
favoritesWidget.addUserCallback = user => {
    ApiConnector.addUserToFavorites(user, response => {
        if (response.success) {
            favoritesWidget.setMessage(false, `пользователь ID ${user.id} "${user.name}" добавлен в адресную книгу`);
            refreshFavoritesList(response.data);
        } else {
            favoritesWidget.setMessage(true, response.data); 
            }
    });
}

//удаление из списка избранного
favoritesWidget.removeUserCallback = user => {
    ApiConnector.removeUserFromFavorites(user, response => {
        if (response.success) {
            favoritesWidget.setMessage(false, `пользователь ID ${user} удален из адресной книги`);
            refreshFavoritesList(response.data);
        } else {
            favoritesWidget.setMessage(true, response.data); 
            }
    });
}