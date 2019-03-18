const MailchimpService = require('./chimp.js');
const querystring = require('querystring');

exports.handler =  (event, context, callback) => {

    var apiKey = process.env.MAILCHIMP_API_KEY;
    var listId = process.env.LIST_ID;
    var params = querystring.parse(event.body);
    var email = params['email'];
    var signupLocation = params['signupLocation'];
    var tag = params['tag'];
    
    console.log(apiKey);
    console.log(listId);
    console.log(email);
    console.log(signupLocation);
    console.log(tag);
    console.log(event.body)
    
    var mailchimpService = new MailchimpService(apiKey, listId);

    mailchimpService.addOrUpdateSubscriber(email, signupLocation, tag, callback);
};

