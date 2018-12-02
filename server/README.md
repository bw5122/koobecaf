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

- string: postID(partition key)
- string: creator
- string: content
- string: createdAt(range key)

## Chat Table

- string: chatID(partition key)
- string[]: members

## Message Table

- string: charID(partition key)
- string: sender
- string: content
- string: createdAt(timestamp)

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
- get: "/getprofile"
- post: "/uploadphoto"

## /friend

- post: "/addfriend"
- post: "/acceptfriend"
- post: "/denyfriend"
- get: "/getfriend"
- get: "/getrecommendation"

## /post

- get: "/getpost"
- post: "/createpost"
- post: "/addcomment"
- post: "/uploadimage"

## /chat

- post: "/creategroupchat"
- post: "/addmembertochat"
- get: "/getallgroupchat"
- get: "/getchathistory"
- post: "/uploadmsg"
