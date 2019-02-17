Meteor.startup(function() {
  if (!Websites.findOne()) {
    console.log('No websites yet. Creating starter data.');
    Websites.insert({
      title: 'Goldsmiths Computing Department',
      url: 'http://www.gold.ac.uk/computing/',
      description: 'This is where this course was developed.',
      upvotes: 0,
      downvotes: 0,
      createdOn: new Date()
    });
    Websites.insert({
      title: 'University of London',
      url:
        'http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route',
      description: 'University of London International Programme.',
      upvotes: 0,
      downvotes: 0,
      createdOn: new Date()
    });
    Websites.insert({
      title: 'Coursera',
      url: 'http://www.coursera.org',
      description: "Universal access to the world's best education.",
      upvotes: 0,
      downvotes: 0,
      createdOn: new Date()
    });
    Websites.insert({
      title: 'Google',
      url: 'http://www.google.com',
      description: 'Popular search engine.',
      upvotes: 0,
      downvotes: 0,
      createdOn: new Date()
    });
  }

  Websites._ensureIndex({
    title: 'text',
    url: 'text',
    description: 'text'
  });
});

Meteor.publish('searchWebsites', function(searchFilter) {
  if (searchFilter) {
    return Websites.find({ $text: { $search: searchFilter } });
  } else {
    return Websites.find({});
  }
});
