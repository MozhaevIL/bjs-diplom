'use strict'

const userForm = new UserForm();

userForm.loginFormCallback = data => {
    console.log(data);
    ApiConnector.login(data, response => {console.log(response);
       if (response.success) {
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
            userForm.setRegisterErrorMessage(response.data)
            location.reload();
         } else {
             location.reload();
         }}
     );
 };