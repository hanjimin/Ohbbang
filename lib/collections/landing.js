LandingEmails = new Mongo.Collection("LandingEmails");

LandingEmails.attachSchema(new SimpleSchema({

    /*requestedAt: {
        type: Date,
        optional: true,
        autoValue: function(){return new Date()}
    },*/
    email : {
        type : String
    }
}));

LandingEmails.allow({
    insert: function () {return false},
    update: function () {return false},
    remove: function () {return false}
});

Meteor.startup(function(){
   if(LandingEmails.find().count() == 0){
       LandingEmails.insert({email:"mohada18@naver.com"});
   }
});