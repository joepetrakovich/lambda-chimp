const Mailchimp = require('mailchimp-api-v3')
const md5 = require('md5');

class MailchimpService {

  constructor(apiKey, listId) {
    this.apiKey = apiKey;
    this.listId = listId;
    this.listPath = '/lists/' + this.listId;
    this.membersPath = this.listPath + '/members/';
    this.segmentsPath = this.listPath + '/segments/';
    this.searchMembersPath = '/search-members/';
    this.mailchimp = new Mailchimp(this.apiKey);
  }

  addOrUpdateSubscriber(emailAddress, signupLocation, tag, callback) {
    var self = this;
    var id = md5(emailAddress.toLowerCase());
    this.mailchimp.get(this.membersPath + id
      ).then(function (member) {
       var existingSignupLocations = member.merge_fields.SIGNUPLOC;
       var signupLocations = existingSignupLocations + ',' + signupLocation; 
       self.updateSubscriber(member.id, emailAddress, tag, signupLocations, callback);      
      })
      .catch(function(err){ 
        self.addSubscriber(emailAddress, signupLocation, tag, callback);
      });
  }

  addSubscriber(emailAddress, signupLocation, tag, callback) {
    var self = this;

    this.mailchimp.post(this.membersPath,
      {
        "email_address": emailAddress,
        "status": "subscribed",
        "merge_fields": {
          "SIGNUPLOC": signupLocation
        }
      }).then(function (results) {
          self.addTagToSubscriber(tag, emailAddress, callback);
      })
      .catch(function (err) {
           callback(err);
      });
  }

  
   updateSubscriber(id, emailAddress, tag, signupLocations, callback) {
    var self = this;
    
    this.mailchimp.patch(this.membersPath + id,
      {
        "status": "subscribed",
        "merge_fields": {
          "SIGNUPLOC": signupLocations
        }
      }).then(function (results) {
        self.addTagToSubscriber(tag, emailAddress, callback);
      })
      .catch(function (err) {
        callback(err);
      });
  }

  addTagToSubscriber(tagName, emailAddress, callback) {
    var self = this;

    this.mailchimp.get(this.segmentsPath
      ).then(function (results) {
       var tag = results.segments.find(t => t.name == tagName);
       self.postEmailAddressToTagMembers(tag.id, emailAddress, callback);
      })
      .catch(function(err){
        callback(err);
      });
  }

  postEmailAddressToTagMembers(tagId, emailAddress, callback) {

    this.mailchimp.post(this.segmentsPath + tagId + '/members',
      {
        "email_address": emailAddress      
      }
      ).then(function (results) {
           if (results.statusCode == 200){
             console.log(results.email_address + " tagged successfully.");
              var response = {
              statusCode: 301,
               headers: {
                  "Location": process.env.THANK_YOU_PAGE
               },
              body: null,
          };
          callback(null, response);
          } else {
              console.log(results.email_address + " had an issue...");
              var badResponse = {
              statusCode: 301,
               headers: {
                  "Location": process.env.SOMETHING_WENT_WRONG_PAGE
               },
              body: null,
          };
          callback(null, badResponse);
          }
      })
      .catch(function (err) {
          callback(err);
      });
  }


}

module.exports = MailchimpService;