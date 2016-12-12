var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/casanyla');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
  console.log('Established connection to MongoDB');
});

var Style = require('../models/style');
var Question = require('../models/question');

var questions = {
  'Your Perfect Holiday': ['History and Culture', 'City Lights', 'Hiking', 'Wellness'],
  'How you like to entertain': ['Relaxed Game Night', 'Cocktail Party', 'Brunch with friends', 'Sit down family meal'],
  'I would love this art piece': ['Tanjore Painting', 'Graffiti Inspired', 'Indian Abstract', 'Van Gogh Print'],
  'Your go to colour': ['Earth Tones', 'Aqua Tones', 'Rich Tones', 'Muted Tones'],
  'Your fashion statement': ['Classic', 'Chic', 'Fusion', 'Elegant'],
  'I like our home described as': ['Cozy', 'Stylish', 'Quirky', 'Vibrant']
}

var q_order = {
  'Your Perfect Holiday': 1,
  'How you like to entertain': 2,
  'I would love this art piece': 3,
  'Your go to colour': 4,
  'Your fashion statement': 5,
  'I like our home described as': 6
}

var opt_images = {
  'History and Culture': 'Q101.jpg',
  'City Lights': 'Q102.jpg',
  'Hiking': 'Q103.jpg',
  'Wellness': 'Q104.jpg',
  'Relaxed Game Night': 'Q201.jpg',
  'Cocktail Party': 'Q202.jpg',
  'Brunch with friends': 'Q203.jpg',
  'Sit down family meal': 'Q204.jpg',
  'Tanjore Painting': 'Q301.jpg',
  'Graffiti Inspired': 'Q302.jpg',
  'Indian Abstract': 'Q303.jpg',
  'Van Gogh Print': 'Q304.jpg',
  'Earth Tones': 'Q401.jpg',
  'Aqua Tones': 'Q402.jpg',
  'Rich Tones': 'Q403.jpg',
  'Muted Tones': 'Q404.jpg',
  'Classic': 'Q501.jpg',
  'Chic': 'Q502.jpg',
  'Fusion': 'Q503.jpg',
  'Elegant': 'Q504.jpg',
  'Cozy': 'Q601.jpg',
  'Stylish': 'Q602.jpg',
  'Quirky': 'Q603.jpg',
  'Vibrant': 'Q604.jpg'
}

var op_maps = {
  'History and Culture': ['Dorchester Comfort', 'Istanbul Mosaic', 'Red Earth', 'Malnad Pure', 'Jodhpur Blues'],
  'City Lights': ['Eiffel Chic', 'Warhol Burst', 'Soho Sophistication', 'Banksy Quirk'],
  'Hiking': ['Ubud Terraces', 'Lunuganga Estate', 'Mekong Meander'],
  'Wellness': ['Sindhoor Colonial', 'Santorini Calm', 'Arctic Zen'],
  'Relaxed Game Night': ['Lunuganga Estate', 'Dorchester Comfort'],
  'Cocktail Party': ['Soho Sophistication', 'Arctic Zen'],
  'Brunch with friends': ['Santorini Calm', 'Eiffel Chic', 'Mekong Meander', 'Warhol Burst', 'Banksy Quirk'],
  'Sit down family meal': ['Sindhoor Colonial', 'Ubud Terraces', 'Jodhpur Blues', 'Istanbul Mosaic', 'Red Earth', 'Malnad Pure'],
  'Tanjore Painting': ['Istanbul Mosaic', 'Sindhoor Colonial', 'Malnad Pure', 'Ubud Terraces'],
  'Graffiti Inspired': ['Warhol Burst', 'Banksy Quirk'],
  'Indian Abstract': ['Soho Sophistication', 'Red Earth', 'Jodhpur Blues', 'Lunuganga Estate', 'Mekong Meander'],
  'Van Gogh Print': ['Eiffel Chic', 'Santorini Calm', 'Arctic Zen', 'Dorchester Comfort'],
  'Earth Tones': ['Red Earth', 'Lunuganga Estate', 'Sindhoor Colonial', 'Malnad Pure', 'Ubud Terraces', 'Warhol Burst'],
  'Aqua Tones': ['Santorini Calm', 'Arctic Zen', 'Jodhpur Blues'],
  'Rich Tones': ['Eiffel Chic', 'Dorchester Comfort', 'Istanbul Mosaic'],
  'Muted Tones': ['Eiffel Chic', 'Mekong Meander', 'Banksy Quirk'],
  'Classic': ['Santorini Calm', 'Ubud Terraces', 'Dorchester Comfort', 'Red Earth'],
  'Chic': ['Eiffel Chic', 'Warhol Burst', 'Banksy Quirk'],
  'Fusion': ['Sindhoor Colonial', 'Lunuganga Estate', 'Jodhpur Blues', 'Mekong Meander', 'Malnad Pure'],
  'Elegant': ['Arctic Zen', 'Soho Sophistication', 'Istanbul Mosaic'],
  'Cozy': ['Ubud Terraces', 'Mekong Meander', 'Lunuganga Estate', 'Dorchester Comfort'],
  'Stylish': ['Santorini Calm', 'Arctic Zen', 'Jodhpur Blues', 'Soho Sophistication'],
  'Quirky': ['Warhol Burst', 'Banksy Quirk'],
  'Vibrant': ['Sindhoor Colonial', 'Istanbul Mosaic', 'Eiffel Chic', 'Red Earth', 'Malnad Pure']
}

var hash_set = {};

Style.find({}, function(err, docs) {
  if (err) throw err;
  docs.forEach(function(doc) {
    hash_set[doc.name] = doc._id;
  });

  // Hash set ready, move on.
  Object.keys(questions).forEach(function(item, key) {
    // console.log(key + ' => ' + item);
    var obj = {};
    obj.name = item;
    obj.order = key;
    obj.active = true;
    obj.options = [];
    questions[item].forEach(function(option, k) {
      // console.log(k + ' => ' + option);
      var opt = {};
      opt.name = option;
      opt.image = opt_images[option];
      opt.relatedStyles = [];

      op_maps[option].forEach(function(map, z) {
        opt.relatedStyles.push(mongoose.Types.ObjectId(hash_set[map]));
      });

      obj.options.push(opt);
    });
    // console.log(obj);
    var newQuestion = new Question(obj);
    newQuestion.save(function(err, doc) {
      if (err) throw err;
      console.log(doc);
    });
  });

});
