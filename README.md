# Full name and SEAS login
Weirong Chen wrchen7@seas.upenn.edu
Han Yan hyan99@seas.upenn.edu
Zhiwei Wang zwangcj@seas.upenn.edu

# Description of feature
1.Sign up for new accounts
2.Update profile info
3.User Home Page
4.Individual and group Chat(message consistency, emoji support)
5.Friend Recommendations with MapReduce (load data from S3 to dynamoDB)
6.Create and delete posts
7.Add comment
8.Share posts
9.Notification 
10.Friend request(accept and deny)
11.Add / delete friends
12.Send public messages
13.Dynamic search field for users
14.Friendship visualization
15.Login session
16.Auto refresh of home page and profile page (every 10 seconds)
17.Change password

# Extra credit claimed
1.Notifications (dynamically generated. Activities that can be notified include: post, share, public message, comment, like, new friend, rejected friend request, new profile photo)
2.“Like” buttons (display how many users have liked the post, support “unlike”)
3.Hashtag for posts and events
4.Friend requests with Add/Deny functionality
5.Privacy control: users can only see posts posted by their friends. Public messages only visible to receiver.
6.Profile picture and gender selection
7.Post with images
8.Share posts
9.Search for events
10.View other users’ profile pages

# Instruction for running the project
1.cd in to “/client”, run ```npm install```
2.cd in to “/server”, run ```npm install```
3. In “/server”, run ```node app``` to start the server
4. In “/client”, run ```npm start``` to start the react server
5. Go to url localhost:3000 to see the page

# List of source files
.
├── client
│   ├── README.md
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   └── manifest.json
│   └── src
│       ├── App.js
│       ├── Assets
│       │   ├── groupchat.png
│       │   ├── like.png
│       │   ├── logo.png
│       │   └── profile.png
│       ├── Components
│       │   ├── ChatRoom.js
│       │   ├── Comment.js
│       │   ├── CreatePost.js
│       │   ├── EventSearchBar.js
│       │   ├── FriendCard.js
│       │   ├── FriendList.js
│       │   ├── FriendListRow.js
│       │   ├── FriendRecommendation.js
│       │   ├── FriendRequest.js
│       │   ├── FriendRequestWindow.js
│       │   ├── FriendSearchBar.js
│       │   ├── GroupChatCreator.js
│       │   ├── GroupChatListRow.js
│       │   ├── InterestTagBox.js
│       │   ├── Navbar.js
│       │   ├── Notification.js
│       │   ├── Post.js
│       │   ├── ScrollList.js
│       │   └── react-chat-window
│       │       ├── README.md
│       │       ├── lib
│       │       │   ├── assets
│       │       │   │   ├── add-icon.png
│       │       │   │   ├── chat-icon.svg
│       │       │   │   ├── close-icon.png
│       │       │   │   ├── image.png
│       │       │   │   └── logo-no-bg.svg
│       │       │   ├── components
│       │       │   │   ├── ChatWindow.js
│       │       │   │   ├── Header.js
│       │       │   │   ├── Launcher.js
│       │       │   │   ├── MessageList.js
│       │       │   │   ├── Messages
│       │       │   │   │   ├── EmojiMessage.js
│       │       │   │   │   ├── TextMessage.js
│       │       │   │   │   └── index.js
│       │       │   │   ├── UserInput.js
│       │       │   │   ├── emoji-picker
│       │       │   │   │   ├── EmojiPicker.js
│       │       │   │   │   └── emojiData.js
│       │       │   │   └── icons
│       │       │   │       ├── EmojiIcon.js
│       │       │   │       └── SendIcon.js
│       │       │   ├── index.js
│       │       │   ├── messageTypes.js
│       │       │   ├── services
│       │       │   │   └── messageBroker.js
│       │       │   └── styles
│       │       │       ├── emojiPicker.css
│       │       │       ├── header.css
│       │       │       ├── index.css
│       │       │       ├── index.js
│       │       │       ├── launcher.css
│       │       │       ├── message.css
│       │       │       └── userInput.css
│       │       └── package.json
│       ├── Pages
│       │   ├── HomePage.js
│       │   ├── LoginPage.js
│       │   ├── ProfilePage.js
│       │   └── UpdateProfile.js
│       ├── Styles
│       │   ├── ChatRoom.css
│       │   ├── FriendList.css
│       │   ├── Home.css
│       │   ├── Navbar.css
│       │   ├── Post.css
│       │   ├── index.css
│       │   └── login.css
│       └── index.js
├── friendMR
│   ├── README
│   ├── build.xml
│   ├── in
│   │   └── graph_new.csv
│   ├── lib
│   │   ├── hadoop-common-2.8.1.jar
│   │   └── hadoop-mapreduce-client-core-2.8.1.jar
│   ├── sampleOutput
│   └── src
│       └── edu
│           └── upenn
│               └── nets212
│                   └── hw3
│                       ├── DiffMapper1.java
│                       ├── DiffMapper2.java
│                       ├── DiffReducer1.java
│                       ├── DiffReducer2.java
│                       ├── FinishMapper.java
│                       ├── FinishReducer.java
│                       ├── InitMapper.java
│                       ├── InitReducer.java
│                       ├── IterMapper1.java
│                       ├── IterMapper2.java
│                       ├── IterMapper3.java
│                       ├── IterReducer1.java
│                       ├── IterReducer2.java
│                       ├── IterReducer3.java
│                       └── SocialRankDriver.java
└── server
    ├── README.md
    ├── app.js
    ├── build
    │   ├── service-worker.js
    │   └── static
    │       └── js
    │           └── runtime~main.229c360f.js
    ├── config
    │   └── authentication.js
    ├── controllers
    │   ├── chat.js
    │   ├── checkInput.js
    │   ├── graph.js
    │   ├── home.js
    │   ├── image.js
    │   ├── notice.js
    │   ├── post.js
    │   ├── recommendation.js
    │   ├── relation.js
    │   ├── search.js
    │   ├── test.js
    │   └── user.js
    ├── models
    │   ├── Relation.js
    │   ├── chat.js
    │   ├── comment.js
    │   ├── database.js
    │   ├── graph.js
    │   ├── image.js
    │   ├── message.js
    │   ├── notice.js
    │   ├── post.js
    │   ├── recommendation.js
    │   └── user.js
    ├── npm-shrinkwrap.json
    ├── package.json
    ├── routers
    │   ├── chat.js
    │   ├── friend.js
    │   ├── post.js
    │   ├── search.js
    │   ├── test.js
    │   └── user.js
    ├── static
    │   ├── css
    │   │   └── base.css
    │   ├── csv
    │   │   ├── graph.csv
    │   │   └── output.csv
    │   ├── dynamo
    │   │   ├── output
    │   │   └── output.json
    │   ├── hadoop
    │   │   └── output.txt
    │   └── js
    │       ├── friendvisualizer.js
    │       └── jit.js
    └── views
        └── friendvisualizer.ejs
 



# Declaration of the submission
##Did you personally write _all_ the code you are submitting
(other than code from the course web page)?
  [v] Yes 
  [ ] No

##Did you copy any code from the Internet, or from classmates?
  [ ] Yes
  [v] No

##Did you collaborate with anyone on this assignment?
  [ ] Yes
  [v] No

