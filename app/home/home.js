'use restrict';

angular.module('webApp.home', ['ngRoute','firebase'])


.config(['$routeProvider', function($routeProvider){
    $routeProvider.when('/home', {
        templateUrl: 'home/home.html',
        controller: 'HomeCtrl',
        // controller: 'StripeCtrl'

    });
}])
    .controller('HomeCtrl', ['$scope', '$window', '$firebaseAuth', function ($scope, $window, $firebaseAuth ){

    $scope.signIn = function(){
        var username = $scope.user.email;
        var password = $scope.user.password;
        var authinticated = false;
        var auth = $firebaseAuth();
        auth.$signInWithEmailAndPassword(username,password).then(function(){
            
            console.log("User Login Success");
            $scope.errMsg = false;
            $window.localStorage.setItem('email', $scope.user.email);
        }).catch(function(error){
            $scope.errMsg = true;
            $scope.errorMessage = error.message
        });
    }
     
}])
.controller('StripeCtrl',function($scope){
    $scope.stripePay=function () {
        var stripe = Stripe('pk_test_fseQvgioTBYVkqdlm4lTlczl');
        var paymentRequest = stripe.paymentRequest({
            country: 'US',
            currency: 'usd',
            total: {
                label: 'Demo total',
                amount: 1000,
            },
        });
        var elements = stripe.elements();
        var prButton = elements.create('paymentRequestButton', {
            paymentRequest: paymentRequest,
        });

        // Check the availability of the Payment Request API first.
        paymentRequest.canMakePayment().then(function (result) {
            if (result) {
                console.log("test1");
                prButton.mount('#payment-request-button');
                paymentRequest.on('token', function (ev) {

                    // Send the token to your server to charge it!
                    fetch('/charges', {
                        method: 'POST',
                        body: JSON.stringify({ token: ev.token.id }),
                        headers: { 'content-type': 'application/json' },
                    })
                        .then(function (response) {
                            console.log(response);
                            if (response.ok) {
                                console.log("succes");
                                // Report to the browser that the payment was successful, prompting
                                // it to close the browser payment interface.
                                ev.complete('success');
                            } else {
                                console.log("failure");
                                // Report to the browser that the payment failed, prompting it to
                                // re-show the payment interface, or show an error message and close
                                // the payment interface.
                                ev.complete('fail');
                            }
                        });
                });
            } else {
                console.log("test2");
                document.getElementById('payment-request-button').style.display = 'none';
                
            }
        });
        
    }
    

}
)

