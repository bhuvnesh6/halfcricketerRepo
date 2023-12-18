var express = require('express');
const sanitizeHtml =require('sanitize-html');
var router = express.Router();
const article = require("./article")
const adminM = require("./users");
const passport = require("passport");
const localStrategy = require("passport-local");
passport.use(new localStrategy(adminM.authenticate()));
//user
const comment = require("./comment");
const upload = require("./Multer");
const contactM = require('./contact');
const prdp = require("./proupdate");
const player = require('./players');
const playerDP = require('./playerDP');
const rate = require("./rating");





router.post('/register', function(req, res) {
  var admindata = new adminM({
    username: req.body.username,
    name: req.body.name,
    secret: req.body.secret
  });

  adminM.register(admindata, req.body.password )
  
  .then(function(registeredAdmin) {
     passport.authenticate("local")(req, res, function() {
      res.render('admin');
    });
  });
});

router.get('/admin', function(req, res, next) {

  if (req.user && req.user.type === 'admin') {
    // If user type is admin, redirect to admin route
    res.render('admin', {adminData: req.user});
  } else {
    // If user type is not admin, redirect to profile route
    res.redirect("/profile");
  }
});

router.get('/message', logincheck,async function(req, res, next) {

  if (req.user && req.user.type === 'admin') {
    // If user type is admin, redirect to admin route
    try {
      const data = await contactM.find();
      res.render('messag', { data });
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error, e.g., send an error response or redirect to an error page
      res.status(500).send('Internal Server Error');
    }
  } else {
    // If user type is not admin, redirect to profile route
    res.redirect("/profile");
  }
});


router.post('/Alogin', passport.authenticate("local", {
  // ...
}), function(req, res, next) {
  // Check user type after successful authentication
  if (req.user && req.user.type === 'admin') {
    // If user type is admin, redirect to admin route
    res.redirect("/admin");
  } else {
    // If user type is not admin, redirect to profile route
    res.redirect("/profile");
  }
});

function logincheck(req, res, next){
if(req.isAuthenticated()){
  return next();
}
else {
  res.render('login');
}}

//signup
router.get('/signup', function(req,res){
  res.render('signup')
})
router.post('/create', function(req, res) {
  const accpt = req.body.check;
  var readerdata = new adminM({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    accepting: accpt === 'on',
    type: "user",
    secret: "hcbrandhaibabde"
  });
  adminM.register(readerdata, req.body.password )
  .then(function(registeredReaders) {
     passport.authenticate("local")(req, res, function() {
      res.redirect("/profile");
    });
  });
});

//log in 
router.get('/login', async function(req,res){
  res.render('login')
})

router.get('/loginerr', async function(req,res){
  res.render('loginerr', {error: req.flash('error')})
})


router.post('/loginuser', passport.authenticate("local", {
  // ...
  failureFlash : true,
  failureRedirect : '/loginerr'
}), function(req, res, next) {
  // Check user type after successful authentication
  if (req.user && req.user.type === 'admin') {
    // If user type is admin, redirect to admin route
    res.redirect("/admin");
  } else {
    // If user type is not admin, redirect to profile route
    res.redirect("/profile");
  }
});

router.get('/profile', readerlogincheck, async function(req, res) {
  // Ensure req.user is available
  if (req.isAuthenticated() && req.user){
       
    const userWithPopulatedData = await adminM
        .findById(req.user._id)
        .populate('followers', 'name')
        .populate('following', 'name')
        .exec();


    res.render('profile', { readersData: userWithPopulatedData, successMessages: req.flash('like'),
    errorMessages: req.flash('unlike'),
    commentMessages: req.flash('commentM'),
    replayMessages: req.flash('replayM'),
  } );
  } else {
    // If not authenticated or user data is missing, handle appropriately
    res.redirect('/signup'); // Or render another appropriate page
  }
});

//writing article
router.get('/write', logincheck, function(req, res){
  if (req.user && req.user.type === 'admin') {
    res.render('wrtitearticle', { adminData: req.user, successFull : req.flash('sucess')
  } );
  } else if (req.user && req.user.type !== 'admin') {
        res.redirect('/profile');
  } else {
    // If not authenticated or user data is missing, handle appropriately
    res.redirect('/login'); // Or render another appropriate page
  }
});

router.get('/manage', readerlogincheck, async function(req, res){
  if (req.user && req.user.type === 'admin') {
     const content = await article.find({}, 'title views');
    res.render('manage', { adminData: req.user, content, successFull : req.flash('Dlt'),
    successEdit : req.flash('edt')
  } );
  } else if (req.user && req.user.type !== 'admin') {
        res.redirect('/profile');
  } else {
    // If not authenticated or user data is missing, handle appropriately
    res.render('login'); // Or render another appropriate page
  }
})


function readerlogincheck(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.render('login');
  }
}

//uploading files to images folder
router.post('/upload', upload.single('image'), logincheck, (req, res) => {
  try {
    if (req.file) {
      const filename = req.file.filename;
      res.json({ uniquename: filename, imageUrl: `/images/uploads/${filename}` });
    } else {
      res.status(400).send('No file uploaded.');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/articleAdd', logincheck, async function(req, res){
     const writeA = new article({
      title: req.body.title, //title
      thumbnail: req.body.thumbnail,  //thumbnail
      discription: req.body.dis,  //discription
      content: req.body.content,  //content
      author:"Nishant Raghav",   // default auther
      tags : req.body.tags,     //tags
      date:  new Date()         //date
     });

     try {
               await writeA.save();
      req.flash('sucess', 'Nishant article Publish ho chuka hai');
      res.redirect('/write');
  } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  };    
})

//gettin article data from DB

router.get("/", async function(req, res){
  let userAuthenticated = req.isAuthenticated()&& req.user;
  let article2 = await article.find({}, 'title _id thumbnail discription views likes Shares').sort({ date: -1 });
  let playerData = await player.find().sort({ 'users': -1, 'ratings': 1  }).exec();
  const sanitizedArticles = article2.map(article2 => {
    const sanitizedContent = sanitizeHtml(article2.content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      allowedAttributes: {
        'img': ['src', 'alt']
      }
  });
  return { ...article2._doc, content: sanitizedContent };
})
res.render('index',{article2: sanitizedArticles, userAuthenticated, playerData })
})


router.get("/api/articles", async function(req, res){
  
  let article2 = await article.find({}, 'title _id discription views likes Shares').sort({ date: -1 });
  

  const sanitizedArticles = article2.map(article2 => {
    const sanitizedContent = sanitizeHtml(article2.content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      allowedAttributes: {
        'img': ['src', 'alt']
      }
  });
  return { ...article2._doc, content: sanitizedContent };
})
res.send({article2: sanitizedArticles, })
})

//filtering throught id

router.get("/articles/:articleId", async function(req, res){
  const articleId = req.params.articleId;
  try {
    const article4 = await article.findOne({_id: articleId}).populate({
      path: 'comments',
      populate: [
        {
          path: 'author',
          model: 'admins'
        },
        {
          path: 'replies',
          populate: [
            {
              path: 'author',
              model: 'admins'
            },
            {
              path: 'replies.author',
              model: 'admins'
            }
          ]
        }
      ]
    });
    
    const sanitizedContent = sanitizeHtml(article4.content, {
      allowedTags:sanitizeHtml.defaults.allowedTags.concat(['img']),
      allowedAttributes:{
        'img':['src', 'alt']
      }
    })
    //defining the current user
    const currentUser = req.isAuthenticated() ? req.user : null;
    //views inscresment
    article4.views += 1;
    //saving provies task
    await article4.save();
    if(req.isAuthenticated()&& req.user){
    const sanitizedArticle = await { ...article4._doc, content: sanitizedContent };
    res.render('article', { article10: sanitizedArticle, currentUser, udata: req.user});
  }
    else {
      const sanitizedArticle = { ...article4._doc, content: sanitizedContent };
    res.render('articles', { article10 : sanitizedArticle});
    }
  }
  catch (error) {
    console.log(error);
    res.send("error aa gya mittar")}
})


router.post('/comment', logincheck, async function(req, res){
  const comnt = await new comment({
    text: req.body.text,
    author: req.body.userId,
    article: req.body.id,
    date: new Date(),
  });
  //settinhg comment id into user model which is adminM
  let uId = req.body.userId ;
  let userSet = await adminM.findOne({_id: uId});
  userSet.comments.push(comnt._id);
  //setting commment id in article modle
  let aId = req.body.id ;
  let articleSet = await article.findOne({_id:aId});
  articleSet.comments.push(comnt._id);

  try {
    await userSet.save();
    await articleSet.save();
    const coms = await comnt.save();
    req.flash('commentM', 'You just successfully commented on an article');
    res.redirect('profile');
} catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
};
})

// sending user to g profile page
router.get("/author/:userID", async function(req, res){
  const currentUser = req.isAuthenticated() ? req.user : null;
  const userID = req.params.userID;
  const userData = await adminM.findOne({ _id: userID}).populate('followers', 'name',)
  .populate('following', 'name',);
  if(req.isAuthenticated()&& req.user){
    res.render('gprofile',{ userData: userData, currentUser  });
  } else {
    res.render('gpro',{ userData: userData});
  }

 
})

//route for replies
router.post('/reply', logincheck, async function(req, res){
  try {
    const cId = req.body.commentId;
    let TEXT = req.body.text1;
    const commentD = await  comment.findOne({ _id: cId});
    const reply = {
      text: TEXT,
      author: req.body.userId,
      date: new Date(),
    };
     await commentD.replies.push(reply);
    await commentD.save();
    req.flash('replayM', 'You just successfully replied on a comment of an article');
    res.redirect('/profile');
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
//rote for like 
// Like or Unlike an article
router.post('/like',logincheck, async (req, res) => {
  try {
    const arid = req.body.ARId ;
    const articlelp = await article.findOne({_id: arid});

    if (!articlelp) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Check if the user has already liked the article
    
      // If not liked, add like
      const liked = articlelp.likes.includes(req.body.likeId);
    if (liked) {
      // If already liked, remove like
      articlelp.likes = articlelp.likes.filter((userId) => userId !== req.body.likeId);
      req.flash('unlike', 'You just successfully unliked an article');
    } else {
      // If not liked, add like
      articlelp.likes.push(req.body.likeId);
      req.flash('like', 'You just successfully liked an article');
    }
   
    await articlelp.save();
    let aurl = req.body.aid;
    res.redirect('/profile' )
  }catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//logout

router.get('/logout', logincheck, function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.get("/delete/:articlID", logincheck, async function(req, res){
  const articlID = req.params.articlID;
  await article.findOneAndDelete({_id : articlID});
  req.flash('Dlt', 'Article delete ho chuka hai');
  res.redirect('/manage');
})

//rote for edit page
router.get("/edit/:articlID", logincheck, async function(req, res){
  const articlID = req.params.articlID;
  let artl = await article.findOne({_id : articlID});
 try{
  const sanitizedContent = sanitizeHtml(artl.content, {
    allowedTags:sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes:{
      'img':['src', 'alt']
    }
  })
  //defining the current user
  if(req.isAuthenticated()&& req.user){
  const sanitizedArticle = await { ...artl._doc, content: sanitizedContent };
  res.render('edit', { updata: sanitizedArticle});
}
  else {
  res.redirect('/profile');
  }
}
catch (error) {
  console.log(error);
  res.send("error aa gya mittar")}
});

//acthul eding process
router.post('/editArt', logincheck, async function(req, res){
  const Eaid = req.body.Eaid;
  let edit = await article.updateMany({_id : Eaid},{
    $set:{
      title: req.body.title, //title
      thumbnail: req.body.thumbnail,  //thumbnail
      discription: req.body.dis,  //discription
      content: req.body.content,  //content
    }
  })


  req.flash('edt', 'Article has been updated');
res.redirect('/manage');

})

router.post('/share', async function(req, res){
  try {
      let shI = req.body.urlid;
      console.log(shI);
      await article.updateOne({ _id: shI }, { $inc: { Shares: 1 } });
  
          res.status(200).json({ success: true, message: 'Share count increased successfully.' });
      
  } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error.' });
  }
});

router.get('/contact', function(req, res){
  res.render('contact',  {success : req.flash('success')});
});

//folow route 
router.post('/follow', logincheck, async (req, res) => {
  try {
    const sub = req.body.Sub;
    const curent = req.body.curent;

    // Find the user being followed and the current user
    const follow = await adminM.findOne({ _id: sub });
    const followin = await adminM.findOne({ _id: curent });

    if (!follow || !followin) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the current user is already following the target user
    const isFollowed = follow.followers.includes(curent);
    const isFollowing = followin.following.includes(sub);

    if (isFollowed) {
      // If already followed, unfollow
      follow.followers = follow.followers.filter(userId => userId !== curent);
      followin.following = followin.following.filter(userId => userId !== sub);

      //req.flash('unlike', 'You unfollowed');
    } else {
      // If not followed, follow
      follow.followers.push(curent);
      followin.following.push(sub);
      //req.flash('like', 'You followed');
    }

    // Save changes for both follow and following
    await Promise.all([follow.save(), followin.save()]);

    res.redirect('/profile');
  } catch (error) {
    console.error('Error during save:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
 
router.get('/mostview', async function(req, res){
  const viewd = await article.find({}, 'title _id thumbnail discription views likes Shares').sort({views: -1})
  res.render('mostviewd', {viewd})
})

router.get('/trending', async function(req, res){
  const trand = await article.find({}, 'title _id thumbnail discription views likes Shares').sort({date: -1, views: -1})
  res.render('trending', {trand})
})

router.post('/contectfom', async function(req, res){
     const send = await new contactM({
          name: req.body.name,
          email: req.body.email,
          issue: req.body.message,
          date: new Date()
     })
     await send.save();
     req.flash('success', 'your massage succwssfully sent some from our team reachout to you');
     res.redirect('/contact')
})

router.get('/editpro',logincheck, function(req, res){

  if(req.isAuthenticated()&& req.user){
    res.render('editpro',{ userData: req.user,});
  } else {
    res.redirect('/login');
  }
})

//update profile route 

router.post("/update-profile", logincheck, prdp.single('profilePicture'), async (req, res)=>{
 try{ const userkiId = req.body.id;
  const profilepic = req.file ? req.file.filename : undefined;
  const  editDATA = await adminM.findOneAndUpdate({_id : userkiId},{
    $set:{
      dp: profilepic,
      name: req.body.name,
      bio: req.body.bio
    }
  })
  res.redirect('/profile');

} catch (error) {
  // Handle errors, log them, and send an appropriate response to the client
  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
}
})

router.get('/about', function(req, res){
  res.render('about');
})

router.get('/terms', function(req, res){
  res.render('terms');
})

router.get('/privacy', function(req, res){
  res.render('privacy');
})

router.get('/copyright', function(req, res){
  res.render('copyright');
})

router.get('/runads', function(req, res){
  res.render('runads');
})

router.post("/result", async (req, res)=>{
  const searchterm = req.body.search;
  try{
    const escapedSearchTerm = searchterm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const article2 = await article.find({title: {
      $regex: new RegExp(escapedSearchTerm, 'i')}});
      res.render('result', {article2})
    }catch(err){
    console.log(err)
      res.status(500).send('internal server error')
  }
})

router.post("/Uresult", async (req, res)=>{
  const searchterm = req.body.search;
  try{
    const escapedSearchTerm = searchterm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const user1 = await adminM.find({name: {
      $regex: new RegExp(escapedSearchTerm, 'i')}});
      res.render('userss', {user1})
    }catch(err){
    console.log(err)
      res.status(500).send('internal server error')
  }
})

router.get('/addplayer', logincheck, async function(req, res){
  
  if (req.user && req.user.type === 'admin') {
    // If user type is admin, redirect to admin route
    res.render('addplayer', {adminData: req.user});
  } else {
    // If user type is not admin, redirect to profile route
    res.redirect("/profile");
  }

})
//adding a player
router.post("/add-player", logincheck, playerDP.single('playerDP'), async (req, res)=>{
 
  try{ 
    const playerpic = req.file ? req.file.filename : undefined;
      const players = await new player({
        image : playerpic,
        name: req.body.name,
        discription: req.body.dis,
      })
      await players.save();
      res.redirect("/admin");
 } catch (error) {
   // Handle errors, log them, and send an appropriate response to the client
   console.error(error);
   res.status(500).json({ error: 'Internal Server Error' });
 }
 });
//player rating feed route
router.get("/ratingfeed", async function(req, res){
     try{
      let playerData = await player.find( ).sort({ 'users': -1, 'ratings': 1  }).exec();
          res.render('ratingfeed', {playerData});
        }catch(error){
          console.error(error);
          res.status(500).send({ error: 'Internal Server Error' });  
         } 
})
//require in item
router.get('/player/:itemId', async function(req, res){
  let itemId = req.params.itemId;
  if(req.isAuthenticated()&& req.user){
    let pdata = await player.findOne({_id: itemId}).populate({path: 'feedbackC',
    populate: 
      {
        path: 'user',
        model: 'admins'
      },})
   
    res.render('rateplayer',{ userData: req.user, pdata});
  } else {
    res.redirect('/login');
  }
})

router.post('/submitRating', logincheck, async function(req, res){
  try{   
     const { rating } = req.body;
     let userID = req.body.userID;
     let playerId = req.body.playerId;
         let heartV =await player.findOneAndUpdate({_id: playerId}, { $inc: { [`ratings.${rating}`]: 1} });
        heartV.users.push(userID);
        
        //creating feedback for user including comment
        let feedback = await new rate ({
          heart : req.body.heartValue,
          user: userID,
          player: playerId,
          comment: req.body.feedback})

        await feedback.save();
     
     await heartV.feedbackC.push(feedback._id);
    await heartV.save()
          res.redirect('/ratingfeed')
 }catch(error){
          console.error(error);
          res.status(500).send({ error: 'Internal Server Error' });  
         } 
})

module.exports = router;
