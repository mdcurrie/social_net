import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.gen
import motor.motor_tornado
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
		client = motor.motor_tornado.MotorClient("mongodb://mcurrie:practice@ds021884.mlab.com:21884/hive")
		client.drop_database("hive")
		self.db = client.hive
		questions = self.db.questions

		def insert_questions(result, error):
			if result:
				questions.insert(
									[{
										"asker":      result[0],
										"group":	  "Music",
										"question":   "Rate Beyonces new album!",
										"date":       datetime.utcnow(),
										"image_link": "http://i.imgur.com/SX3tMDg.jpg",
										"data":     [
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
													]
									},
									{
										"asker":      result[0],
										"question":   "Whos gonna become president? no trolls pls",
										"date":	      datetime.utcnow(),
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
													]
									},
									{
										"asker":       result[1],
										"group":	   "Music",
										"question":    "Best album of 2016?",
										"date":        datetime.utcnow(),
										"image_link":  "http://i.imgur.com/BpXMFZw.jpg",
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
													]
									}]
								)

		self.db.users.insert(
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
									"bio": "I'm new here!"
								}],
								callback=insert_questions
							)

		self.db.groups.insert(
								[{
									"name":			  "Music",
									"pic_link":		  "http://i.imgur.com/2RrtWCM.jpg",
									"posts":		  2,
									"followers":      [],
									"bio":		      "The official music group of Hive. Discuss your favorite music and discover new sounds."
								},
								{
									"name":			  "Sports",
									"pic_link":		  "http://i.imgur.com/Lky0iUM.png",
									"posts":		  0,
									"followers":	  [],
									"bio":		      "The official sports group of Hive. Discuss your favorite sports team. Remember to keep it civil."
								},
								{
									"name":			  "Anime",
									"pic_link":		  "http://i.imgur.com/dNWrYKa.png",
									"posts":		  0,
									"followers":	  [],
									"bio":		      "The official anime group of Hive. Discuss your favorite anime and try not to start any wars."
								}]
							)

		self.db.comments.ensure_index("question_id", unique=True)
		self.db.shares.ensure_index("question_id", unique=True)
		self.db.favorites.ensure_index("question_id", unique=True)
		self.db.followers.ensure_index("user_id", unique=True)
		self.db.following.ensure_index("user_id", unique=True)
		self.db.haters.ensure_index("user_id", unique=True)
		self.db.hating.ensure_index("user_id", unique=True)
		self.db.votes.ensure_index("user_id", unique=True)

		tornado.web.Application.__init__(self, handlers, **settings)	

# get user's information if logged in
class BaseHandler(tornado.web.RequestHandler):
	@tornado.gen.coroutine
	def prepare(self):
		auth_id = self.get_secure_cookie("auth_id")
		self.current_user = None
		if auth_id:
			auth_id      = str(auth_id, "utf-8")
			current_user = yield self.application.db.users.find_one({"email": auth_id}, {"_id": 1})
			if current_user == None:
				self.clear_cookie("auth_id")
			else:
				self.current_user = current_user

# handler for the home page
class IndexHandler(BaseHandler):
	# redirect to /feed if already logged in
	@tornado.gen.coroutine
	def get(self):
		if self.current_user:
			self.redirect("/feed")
		else:
			questions, groups = yield [self.application.db.questions.find().sort("_id", 1).to_list(10),
									   self.application.db.groups.find().to_list(3)]

			temp1, temp2, temp3, askers_temp = yield [self.application.db.favorites.find_one({"question_id": [question["_id"] for question in questions]}),
													  self.application.db.shares.find_one({"question_id": [question["_id"] for question in questions]}),
													  self.application.db.comments.find_one({"question_id": [question["_id"] for question in questions]}),
													  self.application.db.users.find({"_id": {"$in": [question["asker"] for question in questions]}}, {"email": 0, "bio": 0, "password": 0, "salt": 0}).to_list(10)]
			
			favorites = []
			shares    = []
			comments  = []
			askers    = []
			for x in questions:
				favorited = False
				count     = 0
				if temp1:
					for y in temp1:
						if x["_id"] == y["question_id"] and self.current_user in y["user_ids"]:
							favorited = True
							count     = y["count"]
				favorites.append((favorited, count))

				shared = False
				count  = 0
				if temp2:
					for y in temp2:
						if x["_id"] == y["question_id"] and self.current_user in y["user_ids"]:
							shared = True
							count  = y["count"]
				shares.append((shared, count))

				commented = False
				count     = 0
				if temp3:
					for y in temp3:
						if x["_id"] == y["question_id"] and self.current_user in y["user_ids"]:
							commented = True
							count     = y["count"]
				comments.append((commented, count))

				for y in askers_temp:
					if y["_id"] == x["asker"]:
						askers.append(y)

			self.render("index.html", askers=askers, questions=questions, groups=groups, favorites=favorites, shares=shares, comments=comments)

# handler for registering new users
class SignupHandler(BaseHandler):
	# redirect user to /feed if already logged in
	@tornado.gen.coroutine
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
		elif (yield self.application.db.users.find_one({"email": email}, {"_id": 1}) != None):
			self.render("login.html", email=email, email_error='That email is already in use. Want to login?', password_error='')
		elif len(password) < 6:
			self.render("signup.html", username_error='', email_error='', password_error='Your password must be at least 6 characters long.')

		# all checks passed. create db entry for user and redirect to /feed
		else:
			salt     = bcrypt.gensalt()
			password = bcrypt.hashpw(password.encode('utf-8'), salt)
			user     = yield self.application.db.users.insert_one({
				"username":         username,
				"email":            email, 
				"password":         password,
				"salt":             salt,
				"bio":              "I'm new here!",
				"profile_pic_link": "http://i.imgur.com/pq88IQx.png", "questions": 0,
			})

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

	@tornado.gen.coroutine
	def post(self):
		email    = self.get_argument("email")
		password = self.get_argument("password")

		# verify email/password combo
		if re.compile("^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$").match(email) == None:
			self.render("login.html", email=None, email_error='Please enter a valid email address.', password_error='')
		elif len(password) < 6:
			self.render("login.html", email=None, email_error='', password_error='The password you entered is incorrect.')
		else:
			user = yield self.application.db.users.find_one({"email": email}, {"_id": 0, "salt": 1, "password": 1})
			if user == None:
				self.render("login.html", email=None, email_error='The email you entered does not match any account.', password_error='')
			elif bcrypt.hashpw(password.encode('utf-8'), user["salt"]) != user["password"]:
				self.render("login.html", email=None, email_error='', password_error='The password you entered is incorrect.')
			else:
				self.set_secure_cookie("auth_id", email, httponly=True)
				self.redirect("/feed")

# handler for logging users out
class LogoutHandler(BaseHandler):
	def post(self):
		self.clear_cookie("auth_id")
		self.redirect("/")

# handler to check if email from signup form is already in use
class EmailHandler(BaseHandler):
	@tornado.gen.coroutine
	def get(self):
		email = self.get_argument("email")
		if (yield self.application.db.users.find_one({"email": email}, {"_id": 1}) == None):
			self.write({"email_taken": False})
		else:
			self.write({"email_taken": True})

# handler for user to create a question
class CreateQuestionHandler(BaseHandler):
	@tornado.gen.coroutine
	def post(self):
		if self.current_user:
			question_title = self.get_argument("question-title")
			image_link     = self.get_argument("image-link")
			answer_1       = self.get_argument("answer-1")
			answer_2       = self.get_argument("answer-2")
			answer_3       = self.get_argument("answer-3")
			answer_4       = self.get_argument("answer-4")
			answer_5       = self.get_argument("answer-5")

			# check question
			if ((question_title == '') or (answer_1 == '' or answer_2 == '') or
	        	(answer_1 == answer_2) or
	        	(answer_3 != '' and answer_3 in {answer_1, answer_2}) or
	        	(answer_4 != '' and answer_4 in {answer_1, answer_2, answer_3}) or
	        	(answer_5 != '' and answer_5 in {answer_1, answer_2, answer_3, answer_4})): return

			labels = [answer for answer in [answer_1, answer_2, answer_3, answer_4, answer_5] if answer]
			data   = [{'label': label, 'votes': 0} for label in labels]

			question = yield self.application.db.questions.insert_one({
				"asker":      self.current_user["_id"],
				"question":   question_title,
				"date":       datetime.utcnow(),
				"image_link": image_link,
				"data":       data,
			})

			self.redirect("/feed")

		else:
			self.redirect("/signup")

# handler to display individual question page
class QuestionHandler(BaseHandler):
	@tornado.gen.coroutine
	def get(self, question_id):
		question_id = ObjectId(question_id)
		question = yield self.application.db.questions.find_one({"_id": question_id})
		if not question:
			self.redirect("/")
		else:
			temp1, temp2, temp3, asker, vote = yield [self.application.db.favorites.find_one({"question_id": ObjectId(question_id)}),
													  self.application.db.shares.find_one({"question_id": ObjectId(question_id)}),
													  self.application.db.comments.find_one({"question_id": ObjectId(question_id)}),
													  self.application.db.users.find_one({"_id": question["asker"]}, {"email": 0, "bio": 0, "password": 0, "salt": 0}),
													  self.application.db.votes.find_one({"user_id": self.current_user["_id"], "votes.question_id": question_id}, {"_id": 0, "votes.$.vote_index": 1})]

			commenters = None
			if temp3:
				commenters = []
				x = yield self.application.db.users.find({"_id": {"$in": [comment["user_id"] for comment in temp3["comments"]]}}, {"password": 0, "salt": 0, "email": 0, "bio": 0}).to_list(50)
				for q in temp3["comments"]:
					for y in x:
						if y["_id"] == q["user_id"]:
							commenters.append(y)
							break

			favorited = self.current_user and temp1 and self.current_user["_id"] in temp1["user_ids"]
			if temp1: count = temp1["count"]
			else: count = 0
			favorites = [favorited, count]

			shared = self.current_user and temp2 and self.current_user["_id"] in temp2["user_ids"]
			if temp2: count = temp2["count"]
			else: count = 0
			shares = [shared, count]

			commented = self.current_user and temp3 and self.current_user["_id"] in [comment["user_id"] for comment in temp3["comments"]]
			if temp3: count = temp3["count"]
			else: count = 0
			if temp3:
				comments = [commented, count, temp3["comments"]]
			else:
				comments = [commented, count, None]

			if vote:
				vote = vote["votes"][0]['vote_index']

			self.render("question.html", asker=asker, question=question, vote=vote, favorites=favorites, shares=shares, comments=comments, commenters=commenters)

# module to render a question card
class QuestionModule(tornado.web.UIModule):
	def render(self, asker, question, vote, favorites, shares, comments, commenters, show_comments=False):
		return self.render_string("question_module.html", question=question, asker=asker, vote=vote, favorites=favorites, shares=shares, 
														  comments=comments, commenters=commenters, show_comments=show_comments, datetime=datetime, json=json)

	def css_files(self):
		return self.handler.static_url("css/question_module.css")

	def javascript_files(self):
		return [self.handler.static_url("js/Chart.js"),
				self.handler.static_url("js/chartmaker.js"),
				self.handler.static_url("js/question_module.js")]

# handler for adding comments to a question
class CommentHandler(BaseHandler):
	@tornado.gen.coroutine
	def get(self, question_id):
		comment  = self.get_argument("comment")
		comments = yield self.application.db.comments.find_and_modify({"question_id": ObjectId(question_id)}, {"$inc": {"count": 1}, "$push": {"comments": {"user_id": self.current_user["_id"], "date": datetime.utcnow(), "comment": comment}}},
					fields={"comments": 1}, upsert=True, new=True)

		commenters = []
		x = yield self.application.db.users.find({"_id": {"$in": [comment["user_id"] for comment in comments["comments"]]}}, {"password": 0, "salt": 0, "email": 0, "bio": 0}).to_list(50)
		for q in comments["comments"]:
			for y in x:
				if y["_id"] == q["user_id"]:
					commenters.append(y)
					break

		comments = comments["comments"]

		self.render("comment_module.html", question_id=question_id, comments=comments, commenters=commenters, datetime=datetime)

# handler for rendering comments
class CommentModule(tornado.web.UIModule):
	def render(self, question_id, comments, commenters):
		return self.render_string("comment_module.html", question_id=question_id, comments=comments, commenters=commenters, datetime=datetime)

	def css_files(self):
		return self.handler.static_url("css/comment_module.css")

	def javascript_files(self):
		return self.handler.static_url("js/comment_module.js")

# handler for voting on questions
class VoteHandler(BaseHandler):
	@tornado.gen.coroutine
	def get(self, question_id):
		if not self.current_user:
			self.redirect("/signup")
		else:
			question_id = ObjectId(question_id)
			vote_index  = self.get_argument("vote_index")

			p = yield self.application.db.votes.find_one({"user_id": self.current_user["_id"], "votes.question_id": question_id})
			if p:
				l = yield self.application.db.votes.find_and_modify({"user_id": self.current_user["_id"], "votes.question_id": question_id}, {"$set": {"votes.$.vote_index": int(vote_index)}}, {"_id": 0, "votes": 1})
			else:
				l = None
			if l:
				for idx, x in enumerate(l["votes"]):
					if x["question_id"] == question_id:
						old_vote = x["vote_index"]
						break
				
				if old_vote == vote_index:
					question = (yield self.application.db.questions.find_one({"_id": question_id}, {"_id": 0, "data": 1}))["data"]
				else:
					question = (yield self.application.db.questions.find_and_modify({"_id": question_id}, {"$inc": {"data."+str(old_vote)+".votes": -1, "data."+str(vote_index)+".votes": 1}}, {"_id": 0, "data": 1}, new=True))["data"]
			else:
				yield self.application.db.votes.update({"user_id": self.current_user["_id"]}, {"$push": {"votes": {"question_id": ObjectId(question_id), "vote_index": int(vote_index)}}}, upsert=True)
				question = (yield self.application.db.questions.find_and_modify({"_id": question_id}, {"$inc": {"data."+str(vote_index)+".votes": 1}}, {"_id": 0, "data": 1}, new=True))["data"]

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
	@tornado.gen.coroutine
	def get(self, question_id):
		if not self.current_user:
			self.redirect("/signup")
		else:
			question_id = ObjectId(question_id)
			favorites   = yield self.application.db.favorites.find_one({"question_id": question_id}, {"user_ids": 1})
			if favorites == None:
				yield self.application.db.favorites.update({"question_id": question_id}, {"$inc": {"count": 1}, "$push": {"user_ids": self.current_user["_id"]}}, upsert=True)
				self.write({"favorite": True, "count": 1})
			else:
				if self.current_user["_id"] in favorites["user_ids"]:
					favorites = yield self.application.db.favorites.find_and_modify({"question_id": question_id}, {"$inc": {"count": -1}, "$pull": {"user_ids": self.current_user["_id"]}}, new=True)
					if favorites["count"] <= 1000:
						q = favorites["count"]
					elif favorites["count"] <= 999999:
						q = str(round(favorites["count"])/1000, 1) + 'K'
					else:
						q = str(round(favorites["count"])/1000000, 1) + 'M'
					self.write({"favorite": False, "count": q})
				else:
					favorites = yield self.application.db.favorites.find_and_modify({"question_id": question_id}, {"$inc": {"count": 1}, "$push": {"user_ids": self.current_user["_id"]}}, new=True)
					if favorites["count"] <= 1000:
						q = favorites["count"]
					elif favorites["count"] <= 999999:
						q = str(round(favorites["count"])/1000, 1) + 'K'
					else:
						q = str(round(favorites["count"])/1000000, 1) + 'M'
					self.write({"favorite": True, "count": q})

# handler for sharing a question
class ShareHandler(BaseHandler):
	@tornado.gen.coroutine
	def get(self, question_id):
		if not self.current_user:
			self.redirect("/signup")
		else:
			question_id = ObjectId(question_id)
			shares      = yield self.application.db.shares.find_one({"question_id": question_id}, {"user_ids": 1})
			if shares == None:
				yield self.application.db.shares.update({"question_id": question_id}, {"$inc": {"count": 1}, "$push": {"user_ids": self.current_user["_id"]}}, upsert=True)
				self.write({"share": True, "count": 1})
			else:
				if self.current_user["_id"] in shares["user_ids"]:
					shares = yield self.application.db.shares.find_and_modify({"question_id": question_id}, {"$inc": {"count": -1}, "$pull": {"user_ids": self.current_user["_id"]}}, new=True)
					if shares["count"] <= 1000:
						q = shares["count"]
					elif shares["count"] <= 999999:
						q = str(round(shares["count"])/1000, 1) + 'K'
					else:
						q = str(round(shares["count"])/1000000, 1) + 'M'
					self.write({"share": False, "count": q})
				else:
					shares = yield self.application.db.shares.find_and_modify({"question_id": question_id}, {"$inc": {"count": 1}, "$push": {"user_ids": self.current_user["_id"]}}, new=True)
					if shares["count"] <= 1000:
						q = shares["count"]
					elif shares["count"] <= 999999:
						q = str(round(shares["count"])/1000, 1) + 'K'
					else:
						q = str(round(shares["count"])/1000000, 1) + 'M'
					self.write({"share": True, "count": q})

# handler for displaying a user's profile page
class ProfileHandler(BaseHandler):
	@tornado.gen.coroutine
	def get(self, user_id):
		if self.current_user and str(self.current_user["_id"]) == user_id:
			self.redirect("/feed")
		else:
			target_user = yield self.application.db.users.find_one({"_id": ObjectId(user_id)}, {"password": 0, "salt": 0, "hating": 0})
			if not target_user:
				self.redirect("/")
			else:
				ret = yield [self.application.db.questions.find().sort("_id", 1).to_list(10),
							 self.application.db.followers.find_one({"user_id": ObjectId(user_id), "followers": self.current_user["_id"]}, {"followers": 0, "count": 0}),
							 self.application.db.followers.find_one({"user_id": ObjectId(user_id)}, {"_id": 0, "count": 1}),
							 self.application.db.following.find_one({"user_id": ObjectId(user_id), "following": self.current_user["_id"]}, {"following": 0, "count": 0}),
							 self.application.db.following.find_one({"user_id": ObjectId(user_id)}, {"_id": 0, "count": 1}),
							 self.application.db.haters.find_one({"user_id": ObjectId(user_id), "haters": self.current_user["_id"]}, {"haters": 0, "count": 0}),
							 self.application.db.haters.find_one({"user_id": ObjectId(user_id)}, {"_id": 0, "count": 1})]

				questions, follower, followers_count, following, following_count, hater, hater_count = ret

				votes_temp = None
				if self.current_user:
					temp1, temp2, temp3, askers_temp, votes_temp = yield [self.application.db.favorites.find({"question_id": {"$in": [question["_id"] for question in questions]}}).to_list(10),
														  	  self.application.db.shares.find({"question_id": {"$in": [question["_id"] for question in questions]}}).to_list(10),
														      self.application.db.comments.find({"question_id": {"$in": [question["_id"] for question in questions]}}).to_list(10),
														      self.application.db.users.find({"_id": {"$in": [question["asker"] for question in questions]}}, {"email": 0, "bio": 0, "password": 0, "salt": 0}).to_list(10),
														      self.application.db.votes.find_one({"user_id": self.current_user["_id"]})]
				else:
					temp1, temp2, temp3, askers_temp = yield [self.application.db.favorites.find({"question_id": {"$in": [question["_id"] for question in questions]}}).to_list(10),
														  	  self.application.db.shares.find({"question_id": {"$in": [question["_id"] for question in questions]}}).to_list(10),
														      self.application.db.comments.find({"question_id": {"$in": [question["_id"] for question in questions]}}).to_list(10),
														      self.application.db.users.find({"_id": {"$in": [question["asker"] for question in questions]}}, {"email": 0, "bio": 0, "password": 0, "salt": 0}).to_list(10)]

				favorites = []
				shares    = []
				comments  = []
				askers    = []
				votes     = []
				for x in questions:
					favorited = False
					count     = 0
					if temp1:
						for y in temp1:
							if x["_id"] == y["question_id"]:
								count = y["count"]
								if self.current_user and self.current_user["_id"] in y["user_ids"]:
									favorited = True
								break
						favorites.append((favorited, count))
					else:
						favorites.append((False, 0))

					shared = False
					count  = 0
					if temp2:
						for y in temp2:
							if x["_id"] == y["question_id"]:
								count = y["count"]
								if self.current_user and self.current_user["_id"] in y["user_ids"]:
									shared = True
								break
						shares.append((shared, count))
					else:
						shares.append((False, 0))

					commented = False
					count     = 0
					if temp3:
						for y in temp3:
							if x["_id"] == y["question_id"]:
								count = y["count"]
								if self.current_user and self.current_user["_id"] in [q["user_id"] for q in y["comments"]]:
									commented = True
								break	
						comments.append((commented, count, y["comments"]))
					else:
						comments.append((commented, count, None))

					vote = None
					if votes_temp:
						for y in votes_temp["votes"]:
							if x["_id"] == y["question_id"]:
								vote = y["vote_index"]
								break
						votes.append(vote)
					else:
						votes.append(None)

					for y in askers_temp:
						if y["_id"] == x["asker"]:
							askers.append(y)

				self.render("newsfeed.html", profile=target_user, current_user=self.current_user, follower=follower, followers_count=followers_count, following_count=following_count,
										 hater=hater, hater_count=hater_count, askers=askers, questions=questions, votes=votes, favorites=favorites, shares=shares, comments=comments, controlled=False,)

# handler for displaying a user's personalized newsfeed
class FeedHandler(BaseHandler):
	@tornado.gen.coroutine
	def get(self):
		if not self.current_user:
			self.redirect("/")
		else:
			questions, followers_count, following_count, hater_count = yield [self.application.db.questions.find().sort("_id", 1).to_list(10),
																		      self.application.db.followers.find_one({"user_id": self.current_user["_id"]}, {"_id": 0, "count": 1}),
																	          self.application.db.following.find_one({"user_id": self.current_user["_id"]}, {"_id": 0, "count": 1}),
																	          self.application.db.haters.find_one({"user_id": self.current_user["_id"]}, {"_id": 0, "count": 1}),]

			temp1, temp2, temp3, askers_temp, votes_temp = yield [self.application.db.favorites.find({"question_id": {"$in": [question["_id"] for question in questions]}}).to_list(10),
													  self.application.db.shares.find({"question_id": {"$in": [question["_id"] for question in questions]}}).to_list(10),
													  self.application.db.comments.find({"question_id": {"$in": [question["_id"] for question in questions]}}).to_list(10),
													  self.application.db.users.find({"_id": {"$in": [question["asker"] for question in questions]}}, {"email": 0, "bio": 0, "password": 0, "salt": 0}).to_list(10),
													  self.application.db.votes.find_one({"user_id": self.current_user["_id"]})]
			
			favorites = []
			shares    = []
			comments  = []
			askers    = []
			votes     = []
			for x in questions:
				favorited = False
				count     = 0
				if temp1:
					for y in temp1:
						if x["_id"] == y["question_id"]:
							count = y["count"]
							if self.current_user and self.current_user["_id"] in y["user_ids"]:
								favorited = True
							break
					favorites.append((favorited, count))
				else:
					favorites.append((False, 0))

				shared = False
				count  = 0
				if temp2:
					for y in temp2:
						if x["_id"] == y["question_id"]:
							count = y["count"]
							if self.current_user and self.current_user["_id"] in y["user_ids"]:
								shared = True
							break
					shares.append((shared, count))
				else:
					shares.append((False, 0))

				commented = False
				count     = 0
				if temp3:
					for y in temp3:
						if x["_id"] == y["question_id"]:
							count = y["count"]
							if self.current_user and self.current_user["_id"] in [q["user_id"] for q in y["comments"]]:
								commented = True
							break	
					comments.append((commented, count, y["comments"]))
				else:
					comments.append((commented, count, None))

				vote = None
				if votes_temp:
					for y in votes_temp["votes"]:
						if x["_id"] == y["question_id"]:
							vote = y["vote_index"]
							break
					votes.append(vote)
				else:
					votes.append(None)

				for y in askers_temp:
					if y["_id"] == x["asker"]:
						askers.append(y)

			self.render("newsfeed.html", profile=self.current_user, current_user=self.current_user, follower=None, followers_count=followers_count, following_count=following_count,
										 hater=None, hater_count=hater_count, askers=askers, questions=questions, votes=votes, favorites=favorites, shares=shares, comments=comments, controlled=True,)

# handler to follow a user
class FollowHandler(BaseHandler):
	@tornado.gen.coroutine
	def get(self, target_id):
		if not self.current_user:
			self.redirect("/")
		else:
			target_id = ObjectId(target_id)
			if (yield self.application.db.followers.find_one({"user_id": target_id, "followers": self.current_user["_id"]})):
				q = yield [self.application.db.followers.find_and_modify({"user_id": target_id}, {"$inc": {"count": -1}, "$pull": {"followers": self.current_user["_id"]}}, {"_id": 0, "count": 1}, new=True),
						   self.application.db.following.update({"user_id": self.current_user["_id"]}, {"$inc": {"count": -1}, "$pull": {"following": target_id}})]
				self.write({"followers": q[0]["count"], "display_text": "Follow"})
			else:
				q = yield [self.application.db.followers.find_and_modify({"user_id": target_id}, {"$inc": {"count": 1}, "$push": {"followers": self.current_user["_id"]}}, fields={"_id": 0, "count": 1}, upsert=True, new=True),
						   self.application.db.following.update({"user_id": self.current_user["_id"]}, {"$inc": {"count": 1}, "$push": {"following": target_id}}, upsert=True)]
				self.write({"followers": q[0]["count"], "display_text": "Followed"})

# handler to hate a user
class HateHandler(BaseHandler):
	@tornado.gen.coroutine
	def get(self, target_id):
		if not self.current_user:
			self.redirect("/")
		else:
			target_id   = ObjectId(target_id)
			if (yield self.application.db.haters.find_one({"user_id": target_id, "haters": self.current_user["_id"]})):
				q = yield [self.application.db.haters.find_and_modify({"user_id": target_id}, {"$inc": {"count": -1}, "$pull": {"haters": self.current_user["_id"]}}, {"_id": 0, "count": 1}, new=True),
				           self.application.db.hating.update({"user_id": self.current_user["_id"]}, {"$inc": {"count": -1}, "$pull": {"hating": target_id}})]
				self.write({"haters": q[0]["count"], "display_text": "Hate"})
			else:
				q = yield [self.application.db.haters.find_and_modify({"user_id": target_id}, {"$inc": {"count": 1}, "$push": {"haters": self.current_user["_id"]}}, fields={"_id": 0, "count": 1}, upsert=True, new=True),
				           self.application.db.hating.update({"user_id": self.current_user["_id"]}, {"$inc": {"count": 1}, "$push": {"hating": target_id}}, upsert=True)]
				self.write({"haters": q[0]["count"], "display_text": "Hated"})

class GetFollowersHandler(BaseHandler):
	@tornado.gen.coroutine
	def get(self, target_id):
		target_id = ObjectId(target_id)
		followers = yield self.application.db.followers.find_one({"user_id": target_id}, {"_id": 0, "followers": 1})
		if followers:
			followers = yield self.application.db.users.find({"_id": {"$in": followers["followers"]}}, {"username": 1, "profile_pic_link": 1}).to_list(20)
			x, y      = yield [self.application.db.following.find_one({"user_id": self.current_user["_id"]}, {"_id": 0, "following": 1}),
							   self.application.db.hating.find_one({"user_id": self.current_user["_id"]}, {"_id": 0, "hating": 1})]

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
	@tornado.gen.coroutine
	def get(self, target_id):
		target_id = ObjectId(target_id)
		following = yield self.application.db.following.find_one({"user_id": target_id}, {"_id": 0, "following": 1})
		if following:
			following = yield self.application.db.users.find({"_id": {"$in": following["following"]}}, {"username": 1, "profile_pic_link": 1}).to_list(20)
			x, y      = yield [self.application.db.following.find_one({"user_id": self.current_user["_id"]}, {"_id": 0, "following": 1}),
							   self.application.db.hating.find_one({"user_id": self.current_user["_id"]}, {"_id": 0, "hating": 1})]

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
	@tornado.gen.coroutine
	def get(self, target_id):
		target_id = ObjectId(target_id)
		haters    = yield self.application.db.haters.find_one({"user_id": target_id}, {"_id": 0, "haters": 1})
		if haters:
			haters = yield self.application.db.users.find({"_id": {"$in": haters["haters"]}}, {"username": 1, "profile_pic_link": 1}).to_list(20)
			x, y   = yield [self.application.db.following.find_one({"user_id": self.current_user["_id"]}, {"_id": 0, "following": 1}),
			                self.application.db.hating.find_one({"user_id": self.current_user["_id"]}, {"_id": 0, "hating": 1})]

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
