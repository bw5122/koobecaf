# Databse Design

## User Table

- string: userID (partition key)
- string: username (partition key of global secondary index)
- string: password(SHA3)
- string: email
- string: firstname
- string: lastname
- string: photo(url)
- string: status
- string: affiliation
- string: birthday
- string[]: interests
- string[]: groupchats

## Post Table

- string: postID (partition key)
- string: postBy(partition key of global secondary index)
- string: creator
- string: content
- string: image(url)
- string: createdAt(range key of global secondary index)
- string[]: friendtags
- string[]: likes

## Comment Table

- string: commentID(partition key)
- string: postID(gloabl secondary index partition key)
- string: creator
- string: content
- string: createdAt(gloabl secondary index range key)

## Friend Table

- stirng: user1(partition key)
- string: user2
- string: chatID

## Chat Table

- string: chatID(partition key)
- string[]: members

## Message Table

- string: messageID(partition key)
- string: charID(gloabl secondary index partition key)
- string: sender
- string: content
- string: createdAt(gloabl secondary index range key)

## Notice Table

- string: receiver(partition key)
- string: sender
- string: type
- string: content
- string: createdAt(timestamp)

# Routers

## /user

- post: "/login"
- post: "/signup"
- post: "/updateprofile"
- get: "/getprofile/:userID"
- post: "/uploadphoto/:userID"

## /friend

- post: "/addfriend"
- post: "/acceptfriend"
- post: "/denyfriend"
- get: "/getfriend"
- get: "/getrecommendation"

## /post

- get: "/getpost/:userID"
- post: "/createpost"
- post: "/addcomment"
- delete: "/deletecomment"
- post: "/uploadimage"
- get: "/getonepost/:postID"
- get: "/getallpost/:userID"
- get: "/getownpost/:postID"
- post: "/uploadimage/:postID"

## /chat

- post: "/creategroupchat"
- post: "/addmembertochat"
- get: "/getallgroupchat"
- get: "/getchathistory"
- post: "/uploadmsg"

# API Specification

## /user/signup

- req{username, password, firstname, lastname}
- res{firstname, lastname, userID}

## /user/login

- req{username,password}
- res{firstname, lastname, userID}

## /user/getprofile/:userID

- res{lastname,firstname,photo,interests[],status,affiliation,birthday}

## /user/updateprofile

- req{userID,lastname,firstname,photo,interests[],status,affiliation,birthday }
- res{lastname,firstname,photo,interests[],status,affiliation,birthday}

## /post/createpost

- req{postBy, creator, content, friendtags[]}
- res{postBy, creator, content, friendtags[], postID, ID, createdAt}

## /post/getownpost/:userID

- res{[{
  content, createdAt,postID, friendtags[], postBy, image, comments[], likes[]
  }]}

## /post/uploadimage/:postID

- req{image}
- res{image, postBy, creator, content, friendtags[], postID, createdAt}

## /post/addcomment

- req{postID, content, creator}
- res{commentID, postID, content, creator, createdAt}

## /post/deletecomment

- req {commentID}
- res {error}
