import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.gen
import pymongo
import logging
import os.path
import bcrypt
import re
import json
from datetime import datetime
from bson.objectid import ObjectId

from tornado.options import define, options
define("port", default=8000, help="run on the given port", type=int)

class Application(tornado.web.Application):
	def __init__(self):
		handlers = [(r"/feed", FeedHandler),
					(r"/", IndexHandler),
					(r"/login", LoginHandler),
					(r"/logout", LogoutHandler),
					(r"/signup", SignupHandler),
					(r"/email_lookup", EmailHandler),
					(r"/users/(\w+)", ProfileHandler),
					(r"/follow/(\w+)", FollowHandler),
					(r"/hate/(\w+)", HateHandler),
					(r"/users/(\w+)/followers", GetFollowersHandler),
					(r"/users/(\w+)/following", GetFollowingHandler),
					(r"/users/(\w+)/haters", GetHatersHandler),
					(r"/groups/(\w+)", GroupHandler),
					(r"/questions/(\w+)", QuestionHandler),
					(r"/comments/(\w+)", CommentHandler),
					(r"/favorite/(\w+)", FavoriteHandler),
					(r"/share/(\w+)", ShareHandler),
					(r"/vote/(\w+)", VoteHandler),
					(r"/create_question", CreateQuestionHandler),

		]
		settings = dict(
			template_path=os.path.join(os.path.dirname(__file__), "templates"),
			static_path=os.path.join(os.path.dirname(__file__), "static"),
			cookie_secret="bZJc2sWbQLKos6GkHn/VB9oXwQt8S0R0kRvJ5/xJ89E=",
			xsrf_cookies=True,
			login_url="/login",
			ui_modules={"Question": QuestionModule, "Comment": CommentModule},
			debug=True,
		)
		client = pymongo.MongoClient("mongodb://mcurrie:practice@ds021884.mlab.com:21884/hive")
		client.drop_database("hive")
		self.db = client.hive
		users = self.db.users
		user  = users.insert_many(
									[{
										"username":         "BasedGod", 
										"email":            "based@god.com",
										"password":         b'$2b$12$y5gm/JA4Sbqahkuo4o.kX.27IisMTqvAEtSZrxVkJ9ZM.UWHQ476y',
										"salt":			    b'$2b$12$y5gm/JA4Sbqahkuo4o.kX.',
										"profile_pic_link": "http://i.imgur.com/MQam61S.jpg",
										"bio":              "Mogul, First Rapper Ever To Write And Publish A Book at 19, Film Score, Composer, Producer, Director #BASED"
									},
									{
										"username":         "marcus", 
										"email":            "m@e.com",
										"password":         b'$2b$12$y5gm/JA4Sbqahkuo4o.kX.27IisMTqvAEtSZrxVkJ9ZM.UWHQ476y',
										"salt":			    b'$2b$12$y5gm/JA4Sbqahkuo4o.kX.',
										"profile_pic_link": "http://i.imgur.com/pq88IQx.png",
										"bio":              "I'm new here!"
									}]
								)

		groups = self.db.groups
		groups.insert_one({"name":			  "Music",
						   "pic_link":		  "http://i.imgur.com/2RrtWCM.jpg",
						   "posts":			  2,
						   "followers":		  [],
						   "bio":		      "The official music group of Hive. Discuss your favorite music and discover new sounds."})

		groups.insert_one({"name":			  "Sports",
						   "pic_link":		  "http://i.imgur.com/Lky0iUM.png",
						   "posts":			  0,
						   "followers":		  [],
						   "bio":		      "The official sports group of Hive. Discuss your favorite sports team. Remember to keep it civil."})

		groups.insert_one({"name":			  "Anime",
						   "pic_link":		  "http://i.imgur.com/dNWrYKa.png",
						   "posts":			  0,
						   "followers":		  [],
						   "bio":		      "The official anime group of Hive. Discuss your favorite anime and try not to start any wars."})

		questions = self.db.questions
		questions.insert_one({"asker":      self.db.users.find_one({"email": "based@god.com"})["_id"],
						      "group":		"Music",
							  "question":   "Rate Beyonces new album!",
							  "date":       datetime.utcnow(),
							  "image_link": "http://i.imgur.com/SX3tMDg.jpg",
							  "data":		[
					 		 					{
						 		 					"label": "it was LIT",
						 		 					"votes": 12,
					 		 					},
					 		 					{
						 		 					"label": "shes done better",
						 		 					"votes": 19,
					 		 					},
					 		 					{
					 		 						"label": "worse than Miley",
					 		 						"votes": 3,
					 		 					},
					 		  				]})
		
		questions.insert_one({"asker":      self.db.users.find_one({"email": "based@god.com"})["_id"],
							  "question":   "Whos gonna become president? no trolls pls",
							  "date":	    datetime.utcnow(),
					 		  "image_link": "http://i.imgur.com/l4PPTGC.jpg",
					 		  "data":		[
					 		 					{
						 		 					"label": "hillary",
						 		 					"votes": 63,
					 		 					},
					 		 					{
						 		 					"label": "trump",
						 		 					"votes": 13,
					 		 					},
					 		 					{
					 		 						"label": "can obama get another term",
					 		 						"votes": 300,
					 		 					},
					 		 					{
					 		 						"label": "i hate them both",
					 		 						"votes": 120,
					 		 					},
					 		  				]})

		questions.insert_one({"asker":      self.db.users.find_one({"email": "m@e.com"})["_id"],
							  "group":		"Music",
							  "question":   "Best album of 2016?",
							  "date":       datetime.utcnow(),
							  "image_link": "http://i.imgur.com/BpXMFZw.jpg",
							  "data":		[
					 		 					{
						 		 					"label": "views by drake",
						 		 					"votes": 560,
					 		 					},
					 		 					{
						 		 					"label": "tlop by kanye",
						 		 					"votes": 940,
					 		 					},
					 		 					{
					 		 						"label": "lemonade by beyonce",
					 		 						"votes": 20400,
					 		 					},
					 		  				]})

		self.db.comments.ensure_index("question_id", unique=True)
		self.db.shares.ensure_index("question_id", unique=True)
		self.db.favorites.ensure_index("question_id", unique=True)
		self.db.followers.ensure_index("user_id", unique=True)
		self.db.following.ensure_index("user_id", unique=True)
		self.db.haters.ensure_index("user_id", unique=True)
		self.db.hating.ensure_index("user_id", unique=True)
		self.db.votes.ensure_index("user_id", unique=True)

		tornado.web.Application.__init__(self, handlers, **settings)	

class BaseHandler(tornado.web.RequestHandler):
	def get_current_user(self):
		auth_id = self.get_secure_cookie("auth_id")
		if auth_id:
			auth_id      = str(auth_id, "utf-8")
			current_user = self.application.db.users.find_one({"email": auth_id})
			if current_user:
				return current_user
			else:
				self.clear_cookie("auth_id")

		return None

# handler for the home page
class IndexHandler(BaseHandler):
	# redirect to /feed if already logged in
	def get(self):
		if self.current_user:
			self.redirect("/feed")
		else:
			questions = self.application.db.questions.find().sort("_id", pymongo.DESCENDING).limit(10)
			groups    = list(self.application.db.groups.find().limit(3))
			self.render("index.html", questions=questions, groups=groups, db=self.application.db)

# handler for registering new users
class SignupHandler(BaseHandler):
	# redirect user to /feed if already logged in
	def get(self):
		if self.current_user:
			self.redirect("/feed")
		else:
			self.render("signup.html", username_error='', email_error='', password_error='')

	def post(self):
		username = self.get_argument("username")
		email    = self.get_argument("email")
		password = self.get_argument("password")

		# basic checks on password/email
		if len(username) < 6:
			self.render("signup.html", username_error='Your username must be at least 6 characters long.', email_error='', password_error='')
		elif re.compile("^[a-zA-Z0-9_ ]+$").match(username) == None:
			self.render("signup.html", username_error='Letters, numbers, spaces, and underscores only.', email_error='', password_error='')
		elif re.compile("^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$").match(email) == None:
			self.render("signup.html", username_error='', email_error='Please enter a valid email address.', password_error='')
		# redirect user to login if the email already exists. email field is filled in with data from previous form
		elif self.application.db.users.find_one({"email": email}) != None:
			self.render("login.html", email=email, email_error='That email is already in use. Want to login?', password_error='')
		elif len(password) < 6:
			self.render("signup.html", username_error='', email_error='', password_error='Your password must be at least 6 characters long.')
		# all checks passed. create db entry for user and redirect to /feed
		else:
			salt     = bcrypt.gensalt()
			password = bcrypt.hashpw(password.encode('utf-8'), salt)
			user     = self.application.db.users.insert_one({"username": username, "email": email, "password": password, "salt": salt, "bio": "I'm new here!",
															 "profile_pic_link": "http://i.imgur.com/pq88IQx.png", "questions": 0})

			self.set_secure_cookie("auth_id", email, httponly=True)
			self.redirect("/feed")

# handler for logging in registered users
class LoginHandler(BaseHandler):
	# redirect user to /feed if already logged in
	def get(self):
		if self.current_user:
			self.redirect("/feed")
		else:
			self.render("login.html", email=None, email_error='', password_error='')

	def post(self):
		email    = self.get_argument("email")
		password = self.get_argument("password")

		# check email/password combo
		if re.compile("^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$").match(email) == None:
			self.render("login.html", email=None, email_error='Please enter a valid email address.', password_error='')
		elif len(password) < 6:
			self.render("login.html", email=None, email_error='', password_error='The password you entered is incorrect.')
		else:
			user = self.application.db.users.find_one({"email": email}, {"_id": 0, "salt": 1, "password": 1})
			if user == None:
				self.render("login.html", email=None, email_error='The email you entered does not match any account.', password_error='')
			elif bcrypt.hashpw(password.encode('utf-8'), user["salt"]) != user["password"]:
				self.render("login.html", email=None, email_error='', password_error='The password you entered is incorrect.')
			else:
				self.set_secure_cookie("auth_id", email, httponly=True)
				self.redirect("/feed")

# handler for logging users out
class LogoutHandler(BaseHandler):
	@tornado.web.authenticated
	def post(self):
		self.clear_cookie("auth_id")
		self.redirect("/")

# handler to check if email from signup form is already in use
class EmailHandler(BaseHandler):
	def get(self):
		email = self.get_argument("email")
		if self.application.db.users.find_one({"email": email}) == None:
			self.write({"email_taken": False})
		else:
			self.write({"email_taken": True})

# handler for user to create a question
class CreateQuestionHandler(BaseHandler):
	@tornado.web.authenticated
	def post(self):
		question_title = self.get_argument("question-title")
		if question_title == '':
			return

		image_link = self.get_argument("image-link")
		answer_1   = self.get_argument("answer-1")
		answer_2   = self.get_argument("answer-2")
		answer_3   = self.get_argument("answer-3")
		answer_4   = self.get_argument("answer-4")
		answer_5   = self.get_argument("answer-5")

		if answer_1 == '' or answer_2 == '':
			return
		if answer_1 == answer_2:
			return
		if answer_3 != '' and (answer_3 == answer_1 or answer_3 == answer_2):
			return
		if answer_4 != '' and (answer_4 == answer_1 or answer_4 == answer_2 or answer_4 == answer_3):
			return
		if answer_5 != '' and (answer_5 == answer_1 or answer_5 == answer_2 or answer_5 == answer_3 or answer_5 == answer_4):
			return

		labels = [answer for answer in [answer_1, answer_2, answer_3, answer_4, answer_5] if answer]
		data   = [{'label': label, 'votes': 0} for label in labels]

		question = self.application.db.questions.insert_one({"asker":       self.current_user["_id"],
															  "question":   question_title,
															  "date":       datetime.utcnow(),
													 		  "image_link": image_link,
													          "data":       data,
										         			})

		self.redirect("/feed")

# handler to display individual question page
class QuestionHandler(BaseHandler):
	def get(self, question_id):
		question = self.application.db.questions.find_one({"_id": ObjectId(question_id)})
		if question == None:
			pass #TODO
		
		self.render("question.html", question=question, db=self.application.db)

# module to render a question card
class QuestionModule(tornado.web.UIModule):
	def render(self, question, db, show_comments=False):
		asker = db.users.find_one({"_id": question["asker"]}, {"username": 1, "profile_pic_link": 1})

		# get user_ids for all comments on the question
		users     = None
		comments  = db.comments.find_one({"question_id": question["_id"]}, {"comments": 1})
		commented = False
		if comments:
			commented = self.current_user["_id"] in [comment["user_id"] for comment in comments["comments"]]
			user_ids  = [{"_id": comment["user_id"]} for comment in comments["comments"]]
			users     = list(db.users.find({"$or": user_ids}, {"username": 1, "email": 1, "profile_pic_link": 1}))

		shares = db.shares.find_one({"question_id": question["_id"]}, {"_id": 0, "user_ids": 1})
		shared = None
		if shares:
			shared = self.current_user["_id"] in shares["user_ids"]

		favorites = db.favorites.find_one({"question_id": question["_id"]}, {"_id": 0, "user_ids": 1})
		favorited = None
		if favorites:
			favorited = self.current_user["_id"] in favorites["user_ids"]

		# find which choice the user voted for
		vote = None
		if self.current_user:
			q = db.votes.find_one({"user_id": self.current_user["_id"], "votes.question_id": question["_id"]}, {"_id": 0, "votes.$": 1})
			if q:
				vote = q["votes"][0]["vote_index"]

		return self.render_string("question_module.html", question=question, asker=asker, users=users, favorited=favorited, favorites=favorites, shares=shares, shared=shared, 
														  comments=comments, commented=commented, show_comments=show_comments, datetime=datetime, json=json, vote=vote)

	def css_files(self):
		return self.handler.static_url("css/question_module.css")

	def javascript_files(self):
		return [self.handler.static_url("js/Chart.js"),
				self.handler.static_url("js/chartmaker.js"),
				self.handler.static_url("js/question_module.js")]

# handler for adding comments to a question
class CommentHandler(BaseHandler):
	@tornado.web.authenticated
	def get(self, question_id):
		comment  = self.get_argument("comment")
		comments = self.application.db.comments.find_one_and_update({"question_id": ObjectId(question_id)}, {"$set": {"question_id": ObjectId(question_id)}, "$push": {"comments": {"user_id": self.current_user["_id"], "date": datetime.utcnow(), "comment": comment}}},
					projection={"comments": 1}, upsert=True, return_document=pymongo.ReturnDocument.AFTER)

		if comments == None:
			self.redirect("/feed")
		else:
			user_ids = [{"_id": comment["user_id"]} for comment in comments["comments"]]
			users    = list(self.application.db.users.find({"$or": user_ids}, {"username": 1, "email": 1, "profile_pic_link": 1}))
			self.render("comment_module.html", question_id=question_id, comments=comments, users=users, datetime=datetime)

# handler for rendering comments
class CommentModule(tornado.web.UIModule):
	def render(self, question_id, comments, users):
		return self.render_string("comment_module.html", question_id=question_id, comments=comments, users=users, datetime=datetime)

	def css_files(self):
		return self.handler.static_url("css/comment_module.css")

	def javascript_files(self):
		return self.handler.static_url("js/comment_module.js")

# handler for voting on questions
class VoteHandler(BaseHandler):
	@tornado.web.authenticated
	def get(self, question_id):
		question_id = ObjectId(question_id)
		vote_index  = self.get_argument("vote_index")

		l = self.application.db.votes.find_one_and_update({"user_id": self.current_user["_id"], "votes.question_id": question_id}, {"$set": {"votes.$.vote_index": vote_index}}, {"_id": 0, "votes": 1})
		if l:
			for idx, x in enumerate(l["votes"]):
				if x["question_id"] == question_id:
					old_vote = x["vote_index"]
					break
			
			if old_vote == vote_index:
				question = self.application.db.questions.find_one({"_id": question_id}, {"_id": 0, "data": 1})["data"]
			else:
				question = self.application.db.questions.find_one_and_update({"_id": question_id}, {"$inc": {"data."+str(old_vote)+".votes": -1, "data."+str(vote_index)+".votes": 1}}, {"_id": 0, "data": 1}, return_document=pymongo.ReturnDocument.AFTER)["data"]
		else:
			self.application.db.votes.update_one({"user_id": self.current_user["_id"]}, {"$push": {"votes": {"question_id": ObjectId(question_id), "vote_index": vote_index}}}, upsert=True)
			question = self.application.db.questions.find_one_and_update({"_id": question_id}, {"$inc": {"data."+str(vote_index)+".votes": 1}}, {"_id": 0, "data": 1}, return_document=pymongo.ReturnDocument.AFTER)["data"]

		vote_count = sum([q["votes"] for q in question])
		if vote_count <= 1000:
			pass
		elif 1000 < vote_count <= 999999:
			vote_count = str(round(vote_count/1000, 1)) + 'K'
		else:
			vote_count = str(round(vote_count/1000000, 1)) + 'M'

		self.write({"idx": vote_index, "votes": vote_count})

# handler for favoriting a question
class FavoriteHandler(BaseHandler):
	@tornado.web.authenticated
	def get(self, question_id):
		question_id = ObjectId(question_id)
		if self.current_user:
			favorites = self.application.db.favorites.find_one({"question_id": question_id}, {"user_ids": 1})
			if favorites == None:
				self.application.db.favorites.update_one({"question_id": question_id}, {"$set": {"question_id": question_id}, "$push": {"user_ids": self.current_user["_id"]}}, upsert=True)
				self.write({"favorite": True, "count": 1})
			else:
				if self.current_user["_id"] in favorites["user_ids"]:
					favorites = self.application.db.favorites.find_one_and_update({"question_id": question_id}, {"$pull": {"user_ids": self.current_user["_id"]}}, return_document=pymongo.ReturnDocument.AFTER)
					if len(favorites["user_ids"]) <= 1000:
						q = len(favorites["user_ids"])
					elif len(favorites["user_ids"]) <= 999999:
						q = str(round(len(favorites["user_ids"])/1000, 1)) + 'K'
					else:
						q = str(round(len(favorites["user_ids"])/1000000, 1)) + 'M'
					self.write({"favorite": False, "count": q})
				else:
					favorites = self.application.db.favorites.find_one_and_update({"question_id": question_id}, {"$push": {"user_ids": self.current_user["_id"]}}, return_document=pymongo.ReturnDocument.AFTER)
					if len(favorites["user_ids"]) <= 1000:
						q = len(favorites["user_ids"])
					elif len(favorites["user_ids"]) <= 999999:
						q = str(round(len(favorites["user_ids"])/1000, 1)) + 'K'
					else:
						q = str(round(len(favorites["user_ids"])/1000000, 1)) + 'M'
					self.write({"favorite": True, "count": q})

# handler for sharing a question
class ShareHandler(BaseHandler):
	@tornado.web.authenticated
	def get(self, question_id):
		question_id = ObjectId(question_id)
		if self.current_user:
			shares = self.application.db.shares.find_one({"question_id": question_id}, {"user_ids": 1})
			if shares == None:
				self.application.db.shares.update_one({"question_id": question_id}, {"$set": {"question_id": question_id}, "$push": {"user_ids": self.current_user["_id"]}}, upsert=True)
				self.write({"share": True, "count": 1})
			else:
				if self.current_user["_id"] in shares["user_ids"]:
					shares = self.application.db.shares.find_one_and_update({"question_id": question_id}, {"$pull": {"user_ids": self.current_user["_id"]}}, return_document=pymongo.ReturnDocument.AFTER)
					if len(shares["user_ids"]) <= 1000:
						q = len(shares["user_ids"])
					elif len(shares["user_ids"]) <= 999999:
						q = str(round(len(shares["user_ids"])/1000, 1)) + 'K'
					else:
						q = str(round(len(shares["user_ids"])/1000000, 1)) + 'M'
					self.write({"share": False, "count": q})
				else:
					shares = self.application.db.shares.find_one_and_update({"question_id": question_id}, {"$push": {"user_ids": self.current_user["_id"]}}, return_document=pymongo.ReturnDocument.AFTER)
					if len(shares["user_ids"]) <= 1000:
						q = len(shares["user_ids"])
					elif len(shares["user_ids"]) <= 999999:
						q = str(round(len(shares["user_ids"])/1000, 1)) + 'K'
					else:
						q = str(round(len(shares["user_ids"])/1000000, 1)) + 'M'
					self.write({"share": True, "count": q})

# handler for displaying a user's profile page
class ProfileHandler(BaseHandler):
	def get(self, user_id):
		if self.current_user and str(self.current_user["_id"]) == user_id:
			self.redirect("/feed")
		else:
			target_user = self.application.db.users.find_one({"_id": ObjectId(user_id)}, {"password": 0, "salt": 0, "hating": 0})
			if target_user == None:
				self.redirect("/")
			else:
				questions = self.application.db.questions.find().sort("_id", pymongo.DESCENDING).limit(10)
				follower        = self.application.db.followers.find_one({"user_id": ObjectId(user_id), "followers": self.current_user["_id"]}, {"followers": 0, "count": 0})
				followers_count = self.application.db.followers.find_one({"user_id": ObjectId(user_id)}, {"_id": 0, "count": 1})
				following       = self.application.db.following.find_one({"user_id": ObjectId(user_id), "following": self.current_user["_id"]}, {"following": 0, "count": 0})
				following_count = self.application.db.following.find_one({"user_id": ObjectId(user_id)}, {"_id": 0, "count": 1})
				hater           = self.application.db.haters.find_one({"user_id": ObjectId(user_id), "haters": self.current_user["_id"]}, {"haters": 0, "count": 0})
				hater_count     = self.application.db.haters.find_one({"user_id": ObjectId(user_id)}, {"_id": 0, "count": 1})
				self.render("newsfeed.html", profile=target_user, current_user=self.current_user, follower=follower, followers_count=followers_count, following=following, following_count=following_count, hater=hater, hater_count=hater_count, questions=questions, controlled=False, db=self.application.db)

# handler for displaying a user's personalized newsfeed
class FeedHandler(BaseHandler):
	@tornado.web.authenticated
	def get(self):
		questions = self.application.db.questions.find().sort("_id", pymongo.DESCENDING).limit(10)
		followers_count = self.application.db.followers.find_one({"user_id": self.current_user["_id"]}, {"_id": 0, "count": 1})
		following_count = self.application.db.following.find_one({"user_id": self.current_user["_id"]}, {"_id": 0, "count": 1})
		hater_count     = self.application.db.haters.find_one({"user_id": self.current_user["_id"]}, {"_id": 0, "count": 1})
		self.render("newsfeed.html", profile=self.current_user, current_user=self.current_user, follower=None, followers_count=followers_count, following=None, following_count=following_count, hater=None, hater_count=hater_count, questions=questions, controlled=True, db=self.application.db)

# handler to follow a user
class FollowHandler(BaseHandler):
	@tornado.web.authenticated
	def get(self, target_id):
		target_id   = ObjectId(target_id)
		if self.application.db.followers.find_one({"user_id": target_id, "followers": self.current_user["_id"]}):
			q = self.application.db.followers.find_one_and_update({"user_id": target_id}, {"$inc": {"count": -1}, "$pull": {"followers": self.current_user["_id"]}}, {"_id": 0, "count": 1}, return_document=pymongo.ReturnDocument.AFTER)
			self.application.db.following.update_one({"user_id": self.current_user["_id"]}, {"$inc": {"count": -1}, "$pull": {"following": target_id}})
			self.write({"followers": q["count"], "display_text": "Follow"})
		else:
			q = self.application.db.followers.find_one_and_update({"user_id": target_id}, {"$inc": {"count": 1}, "$push": {"followers": self.current_user["_id"]}}, {"_id": 0, "count": 1}, upsert=True, return_document=pymongo.ReturnDocument.AFTER)
			self.application.db.following.update_one({"user_id": self.current_user["_id"]}, {"$inc": {"count": 1}, "$push": {"following": target_id}}, upsert=True)
			self.write({"followers": q["count"], "display_text": "Followed"})

# handler to hate a user
class HateHandler(BaseHandler):
	@tornado.web.authenticated
	def get(self, target_id):
		target_id   = ObjectId(target_id)
		if self.application.db.haters.find_one({"user_id": target_id, "haters": self.current_user["_id"]}):
			q = self.application.db.haters.find_one_and_update({"user_id": target_id}, {"$inc": {"count": -1}, "$pull": {"haters": self.current_user["_id"]}}, {"_id": 0, "count": 1}, return_document=pymongo.ReturnDocument.AFTER)
			self.application.db.hating.update_one({"user_id": self.current_user["_id"]}, {"$inc": {"count": -1}, "$pull": {"hating": target_id}})
			self.write({"haters": q["count"], "display_text": "Hate"})
		else:
			q = self.application.db.haters.find_one_and_update({"user_id": target_id}, {"$inc": {"count": 1}, "$push": {"haters": self.current_user["_id"]}}, {"_id": 0, "count": 1}, upsert=True, return_document=pymongo.ReturnDocument.AFTER)
			self.application.db.hating.update_one({"user_id": self.current_user["_id"]}, {"$inc": {"count": 1}, "$push": {"hating": target_id}}, upsert=True)
			self.write({"haters": q["count"], "display_text": "Hated"})

class GetFollowersHandler(BaseHandler):
	def get(self, target_id):
		target_id = ObjectId(target_id)
		followers = self.application.db.followers.find_one({"user_id": target_id}, {"_id": 0, "followers": 1})
		if followers:
			followers = list(self.application.db.users.find({"_id": {"$in": followers["followers"]}}, {"username": 1, "profile_pic_link": 1}))
			x         = self.application.db.following.find_one({"user_id": self.current_user["_id"]}, {"_id": 0, "following": 1})
			y         = self.application.db.hating.find_one({"user_id": self.current_user["_id"]}, {"_id": 0, "hating": 1})
			logging.info(followers)
			for follower in followers:
				follower["_id"] = str(follower["_id"])
				if self.current_user and follower["_id"] == str(self.current_user["_id"]):
					follower["follow_text"] = False
					follower["hate_text"]   = False
					continue
				if self.current_user and x and ObjectId(follower["_id"]) in x["following"]:
					follower["follow_text"] = "Following"
				else:
					follower["follow_text"] = "Follow"
				if self.current_user and y and ObjectId(follower["_id"]) in y["hating"]:
					follower["hate_text"] = "Hating"
				else:
					follower["hate_text"] = "Hate"

			self.write(json.dumps(list(followers)))

class GetFollowingHandler(BaseHandler):
	def get(self, target_id):
		target_id = ObjectId(target_id)
		following = self.application.db.following.find_one({"user_id": target_id}, {"_id": 0, "following": 1})
		if following:
			following = list(self.application.db.users.find({"_id": {"$in": following["following"]}}, {"username": 1, "profile_pic_link": 1}))
			x         = self.application.db.following.find_one({"user_id": self.current_user["_id"]}, {"_id": 0, "following": 1})
			y         = self.application.db.hating.find_one({"user_id": self.current_user["_id"]}, {"_id": 0, "hating": 1})
			for follower in following:
				follower["_id"] = str(follower["_id"])
				if self.current_user and follower["_id"] == str(self.current_user["_id"]):
					follower["follow_text"] = False
					follower["hate_text"]   = False
					continue
				if self.current_user and x and ObjectId(follower["_id"]) in x["following"]:
					follower["follow_text"] = "Following"
				else:
					follower["follow_text"] = "Follow"
				if self.current_user and y and ObjectId(follower["_id"]) in y["hating"]:
					follower["hate_text"] = "Hating"
				else:
					follower["hate_text"] = "Hate"

			self.write(json.dumps(list(following)))

class GetHatersHandler(BaseHandler):
	def get(self, target_id):
		target_id = ObjectId(target_id)
		haters    = self.application.db.haters.find_one({"user_id": target_id}, {"_id": 0, "haters": 1})
		if haters:
			haters = list(self.application.db.users.find({"_id": {"$in": haters["haters"]}}, {"username": 1, "profile_pic_link": 1}))
			x         = self.application.db.following.find_one({"user_id": self.current_user["_id"]}, {"_id": 0, "following": 1})
			y         = self.application.db.hating.find_one({"user_id": self.current_user["_id"]}, {"_id": 0, "hating": 1})
			for follower in haters:
				follower["_id"] = str(follower["_id"])
				if self.current_user and follower["_id"] == str(self.current_user["_id"]):
					follower["follow_text"] = False
					follower["hate_text"]   = False
					continue
				if self.current_user and x and ObjectId(follower["_id"]) in x["following"]:
					follower["follow_text"] = "Following"
				else:
					follower["follow_text"] = "Follow"
				if self.current_user and y and ObjectId(follower["_id"]) in y["hating"]:
					follower["hate_text"] = "Hating"
				else:
					follower["hate_text"] = "Hate"

			self.write(json.dumps(list(haters)))

class GroupHandler(BaseHandler):
	def get(self, group_name):
		target_group = self.application.db.groups.find_one({"name": group_name})
		questions = self.application.db.questions.find({"group": group_name}).sort("_id", pymongo.DESCENDING).limit(10)
		self.render("group.html", profile=target_group, current_user=self.current_user, questions=questions, db=self.application.db)

if __name__ == "__main__":
	tornado.options.parse_command_line()
	http_server = tornado.httpserver.HTTPServer(Application())
	http_server.listen(options.port)
	tornado.ioloop.IOLoop.instance().start()
