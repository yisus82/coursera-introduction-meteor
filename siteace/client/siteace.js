/// routing

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', {
  name: 'root',
  action() {
    this.render('navbar', {
      to: 'navbar'
    });
    this.render('websites', {
      to: 'main'
    });
  }
});

Router.route('/websites', {
  name: 'websites',
  action() {
    this.render('navbar', {
      to: 'navbar'
    });
    this.render('websites', {
      to: 'main'
    });
  }
});

Router.route('/website/:_id', {
  name: 'website_id',
  action() {
    this.render('navbar', {
      to: 'navbar'
    });
    this.render('website', {
      to: 'main',
      data: function() {
        Meteor.subscribe('searchWebsites', Session.get('searchFilter'));
        return Websites.findOne({ _id: this.params._id });
      }
    });
  }
});

/// accounts config
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});

/////
// template helpers
/////

Template.website_list.helpers({
  websites: function() {
    Meteor.subscribe('searchWebsites', Session.get('searchFilter'));
    if (Session.get('searchFilter')) {
      return Websites.find(
        {},
        { sort: { upvotes: -1, downvotes: 1, createdOn: -1 } }
      );
    } else {
      return Websites.find(
        {},
        { sort: { upvotes: -1, downvotes: 1, createdOn: -1 } }
      );
    }
  },
  filtering: function() {
    if (Session.get('searchFilter')) {
      return true;
    } else {
      return false;
    }
  },
  getFilterWords: function() {
    if (Session.get('searchFilter')) {
      return Session.get('searchFilter');
    } else {
      return false;
    }
  }
});

Template.website_item.helpers({
  formatDate: function(date) {
    return moment(date).format('l LT');
  }
});

Template.website.helpers({
  formatDate: function(date) {
    return moment(date).format('l LT');
  }
});

/////
// template events
/////

Template.searchBox.events({
  'submit .js-set-filter': function(event) {
    var words = event.target.search.value;
    console.log('Creating filter with words: ' + words);
    Session.set('searchFilter', words);
    return false;
  }
});

Template.website_list.events({
  'click .js-unset-filter': function(event) {
    Session.set('searchFilter', undefined);
    $('#search').val('');
  }
});

Template.website_item.events({
  'click .js-upvote': function(event) {
    var website_id = this._id;
    console.log('Up voting website with id ' + website_id);
    if (Meteor.user()) {
      Websites.update({ _id: website_id }, { $inc: { upvotes: 1 } });
      // { $addToSet: { upvotes: Meteor.user()._id }, $pull: { downvotes: Meteor.user()._id } });
    }
    return false; // prevent the button from reloading the page
  },
  'click .js-downvote': function(event) {
    var website_id = this._id;
    console.log('Down voting website with id ' + website_id);
    if (Meteor.user()) {
      Websites.update({ _id: website_id }, { $inc: { downvotes: 1 } });
      // { $addToSet: { downvotes: Meteor.user()._id }, $pull: { upvotes: Meteor.user()._id } });
    }
    return false; // prevent the button from reloading the page
  }
});

Template.website_form.events({
  'click .js-toggle-website-form': function(event) {
    $('#website_form').toggle('slow');
  },
  'submit .js-save-website-form': function(event) {
    var url = event.target.url.value;
    var title = event.target.title.value;
    var description = event.target.description.value;
    extractMeta(url, function(error, result) {
      console.log(result);
      if (!title) {
        title = result.title || url;
      }
      if (!description) {
        description = result.description || title || description;
      }
      console.log('The url is: ' + url);
      console.log('The title is: ' + title);
      console.log('The description is: ' + description);

      if (Meteor.user()) {
        Websites.insert({
          url: url,
          title: title,
          description: description,
          upvotes: 0,
          downvotes: 0,
          createdOn: new Date(),
          createdBy: Meteor.user()._id
        });
      }
    });
    $('#website_form').toggle('slow');
    return false; // stop the form submit from reloading the page
  }
});

Template.website.events({
  'click .js-upvote': function(event) {
    var website_id = this._id;
    console.log('Up voting website with id ' + website_id);
    if (Meteor.user()) {
      Websites.update({ _id: website_id }, { $inc: { upvotes: 1 } });
      //  { $addToSet: { upvotes: Meteor.user()._id }, $pull: { downvotes: Meteor.user()._id } });
    }
    return false; // prevent the button from reloading the page
  },
  'click .js-downvote': function(event) {
    var website_id = this._id;
    console.log('Down voting website with id ' + website_id);
    if (Meteor.user()) {
      Websites.update({ _id: website_id }, { $inc: { upvotes: 1 } });
      // { $addToSet: { downvotes: Meteor.user()._id }, $pull: { upvotes: Meteor.user()._id } });
    }
    return false; // prevent the button from reloading the page
  },
  'submit .js-comment-form': function(event) {
    var website_id = this._id;
    var text = event.target.comment.value;
    console.log('Commenting website with id ' + website_id);
    console.log('Comment: ' + text);
    if (Meteor.user()) {
      comment = {
        createdBy: Meteor.user()._id,
        author: Meteor.user().username,
        createdOn: new Date(),
        text: text
      };
      Websites.update(
        { _id: website_id },
        { $push: { comments: { $each: [comment], $position: 0 } } }
      );
    }
    return false; // prevent the button from reloading the page
  }
});
