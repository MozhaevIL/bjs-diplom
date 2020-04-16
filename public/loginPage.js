'use strict'

const userForm = new UserForm();

userForm.loginFormCallback = data => {
    console.log(data);
    ApiConnector.login(data, response => {console.log(response);
       if (response.success === true) {
           console.log('Авторизация успешна');
           location.reload();
        } else {
            console.log('Авторизация неудачна');
            userForm.setLoginErrorMessage(response.data);
        }}
    );
};

userForm.registerFormCallback = data => {
    console.log(data);
    ApiConnector.register(data, response => {console.log(response);
        if (response.success === false) {
            console.log('Регистрация неудачна');
            userForm.setRegisterErrorMessage(response.data)
            location.reload();
         } else {
             console.log('Регистрация успешна');
             location.reload();
         }}
     );
 };