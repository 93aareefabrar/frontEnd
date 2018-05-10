'use restrict';

angular.module('webApp.stripeForm', ['ngRoute', 'firebase'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/stripeForm', {
      templateUrl: '/stripeForm/stripeForm.html',
      controller: 'StripeCtrl'
    });
  }])
  .controller('StripeCtrl', ['$scope', '$firebaseAuth', '$http', '$window', function ($scope, $firebaseAuth, $http,$window) {
    var card;
    var stripe = Stripe('pk_test_J0wFOYMrJQQsLv874nTFU9AT');
    
    $scope.init = function () {
      
      var elements = stripe.elements({
        fonts: [
          {
            cssSrc: 'https://fonts.googleapis.com/css?family=Roboto',
          },
        ],
        // Stripe's examples are localized to specific languages, but if
        // you wish to have Elements automatically detect your user's locale,
        // use `locale: 'auto'` instead.
        locale: window.__exampleLocale
      });

      card = elements.create('card', {
        iconStyle: 'solid',
        style: {
          base: {
            iconColor: '#c4f0ff',
            color: '#fff',
            fontWeight: 500,
            fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
            fontSize: '16px',
            fontSmoothing: 'antialiased',

            ':-webkit-autofill': {
              color: '#fce883',
            },
            '::placeholder': {
              color: '#87BBFD',
            },
          },
          invalid: {
            iconColor: '#FFC7EE',
            color: '#FFC7EE',
          },
        },
      });
      card.mount('#example1-card');
    }
    $scope.stripePay = function () {
      // Create a token or display an error when the form is submitted.
      var form = document.getElementById('payment-form');
      form.addEventListener('submit', function (event) {
        event.preventDefault();

        stripe.createToken(card).then(function (result) {
          if (result.error) {
            // Inform the customer that there was an error.

          } else {
            console.log(result.token)
            // Simple GET request example:
            $http({
              method: 'POST',
              url: 'https://3115a353.ngrok.io/charge',
              data: { token: result.token, email: $scope.user.email }
            }).then(function successCallback(response) {
              console.log("DONE ")
              console.log(JSON.stringify(response));
            }, function errorCallback(response) {
              console.log("NOT DONE ")
              console.log(JSON.stringify(response));
            });
          }
        });
      });
    }
    $scope.init();
  }
  ]
  )
