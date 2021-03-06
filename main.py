import tornado.httpserver
import tornado.httpclient
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.gen
import motor.motor_tornado
import logging
import os.path
import imghdr
import bcrypt
import re
import json
from datetime import datetime, timedelta
from bson.objectid import ObjectId

# imghdr patch to recognize jpeg format
def test_icc_profile_images(h, f):
	if h.startswith(b'\xff\xd8'):
		return "jpeg"
imghdr.tests.append(test_icc_profile_images)

from tornado.options import define, options
define("port", default=8000, help="run on the given port", type=int)

class Application(tornado.web.Application):
	def __init__(self):
		handlers = [(r"/feed", FeedHandler),
					(r"/feed/recent", RecentFeedHandler),
					(r"/", IndexHandler),
					(r"/login", LoginHandler),
					(r"/logout", LogoutHandler),
					(r"/signup", SignupHandler),
					(r"/settings", SettingsHandler),
					(r"/settings/(\w+)", SettingsHandler),
					(r"/email_lookup", EmailHandler),
					(r"/users/(\w+)", ProfileHandler),
					(r"/follow_or_hate/(\w+)", FollowHateHandler),
					(r"/users/(\w+)/get_relationships", GetRelationshipsHandler),
					(r"/questions/(\w+)", QuestionHandler),
					(r"/comments/(\w+)", CommentHandler),
					(r"/favorite_or_share/(\w+)", FavoriteShareHandler),
					(r"/vote/(\w+)", VoteHandler),
					(r"/create_question", CreateQuestionHandler),
					(r"/add_topic", AddTopicToFeed),
					(r"/topics/(\w+)", TopicHandler),
					(r"/topics/(\w+)/recent", RecentTopicHandler),
					(r"/topics/(\w+)/get_followers", GetTopicFollowersHandler),
					(r"/favorites", FavoritesHandler),
					(r"/favorites/recent", RecentFavoritesHandler),
					(r"/search", SearchHandler),
					(r"/process_notifications", NotificationsHandler),
					(r"/(\w+)", CustomURLHandler),
		]
		settings = dict(
			template_path=os.path.join(os.path.dirname(__file__), "templates"),
			static_path=os.path.join(os.path.dirname(__file__), "static"),
			cookie_secret="bZJc2sWbQLKos6GkHn/VB9oXwQt8S0R0kRvJ5/xJ89E=",
			xsrf_cookies=True,
			login_url="/login",
			ui_modules={"Question": QuestionModule, "Comment": CommentModule, "Header": HeaderModule, "SideColumn": SideColumnModule, "MobileTabBar": MobileTabBarModule},
			debug=True,
		)
		client = motor.motor_tornado.MotorClient("mongodb://mcurrie:practice@ds021884.mlab.com:21884/hive")
		self.db = client.hive
		tornado.web.Application.__init__(self, handlers, **settings)	

# module to render the page header
class HeaderModule(tornado.web.UIModule):
	def render(self, page, search=True):
		return self.render_string("header_module.html", current_user=self.current_user, page=page, search=search, datetime=datetime)

	def css_files(self):
		return self.handler.static_url("css/header_module.css")

	def javascript_files(self):
		return self.handler.static_url("js/header_module.js")

# module to render the side column
class SideColumnModule(tornado.web.UIModule):
	def render(self, title):
		return self.render_string("sidecolumn_module.html", current_user=self.current_user, title=title)

	def css_files(self):
		return self.handler.static_url("css/sidecolumn_module.css")

	def javascript_files(self):
		return self.handler.static_url("js/sidecolumn_module.js")

#module to render the mobile tab bar
class MobileTabBarModule(tornado.web.UIModule):
	def render(self, page):
		return self.render_string("mobiletabbar_module.html", page=page)

	def css_files(self):
		return self.handler.static_url("css/mobiletabbar_module.css")

# get user's information if logged in
# prepare() runs at the start of each request
class BaseHandler(tornado.web.RequestHandler):
	@tornado.gen.coroutine
	def prepare(self):
		self.current_user = None
		auth_id           = self.get_secure_cookie("auth_id")
		if auth_id:
			auth_id = str(auth_id, "utf-8")
			try:
				auth_id = ObjectId(auth_id)
			except:
				self.clear_cookie("auth_id")
				self.redirect("/login")
			else:
				current_user = yield self.application.db.users.find_one({"_id": auth_id}, {"salt": 0, "password": 0, "question_count": 0, "username_search": 0})
				if current_user:
					self.current_user = current_user
				else:
					self.clear_cookie("auth_id")

# handler for registering new users
class SignupHandler(BaseHandler):
	def get(self):
		# redirect user to /feed if already logged in
		if self.current_user:
			self.redirect("/feed")
		else:
			self.render("signup.html", username_error='', email_error='', password_error='')

	# get info from signup form and register new user
	@tornado.gen.coroutine
	def post(self):
		username, email, password = self.get_argument("username"), self.get_argument("email"), self.get_argument("password")

		# basic checks on password/email
		if len(username) < 6 or len(username) > 25:
			self.render("signup.html", username_error='Your username must be 6-25 characters long.', email_error='', password_error='')
		elif re.compile("^[a-zA-Z0-9_. ]+$").match(username) == None:
			self.render("signup.html", username_error='Letters, numbers, spaces, and underscores only.', email_error='', password_error='')
		elif re.compile("^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$").match(email) == None:
			self.render("signup.html", username_error='', email_error='Please enter a valid email address.', password_error='')

		# redirect user to login if the email already exists. email field is filled in with data from previous form
		elif (yield self.application.db.users.find_one({"email": email}, {"_id": 1})):
			self.render("login.html", email=email, email_error='That email is already in use. Want to login?', password_error='')
		elif len(password) < 6:
			self.render("signup.html", username_error='', email_error='', password_error='Your password must be at least 6 characters long.')

		# all checks passed. create db entry for user and redirect to /feed
		else:
			salt     = bcrypt.gensalt()
			password = bcrypt.hashpw(password.encode('utf-8'), salt)
			user     = yield self.application.db.users.insert({
					"username":         username,
					"username_search":  username.lower(),
					"email":            email, 
					"password":         password,
					"salt":             salt,
					"bio":              "I'm new here!",
					"profile_pic_link": "http://i.imgur.com/pq88IQx.png",
					"join_date":		datetime.utcnow(),
					"notifications":    [[False, "", "http://i.imgur.com/pq88IQx.png", "Hi " + username + ", thanks so much for joining Hive. Get started by following some of your favorite users or topics.", datetime.utcnow()]]})

			self.set_secure_cookie("auth_id", str(user), httponly=True)
			self.redirect("/feed")

# handler to check if email from signup form is already in use
class EmailHandler(BaseHandler):
	@tornado.gen.coroutine
	def get(self):
		email = self.get_argument("email")
		if (yield self.application.db.users.find_one({"email": email}, {"_id": 1})):
			self.write({"email_taken": True})
		else:
			self.write({"email_taken": False})

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
		email, password = self.get_argument("email"), self.get_argument("password")

		# verify email/password combo
		if re.compile("^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$").match(email) == None:
			self.render("login.html", email=email, email_error='Please enter a valid email address.', password_error='')
		elif len(password) < 6:
			self.render("login.html", email=email, email_error='', password_error='The password you entered is incorrect.')
		else:
			user = yield self.application.db.users.find_one({"email": email}, {"salt": 1, "password": 1})
			if not user:
				self.render("login.html", email=email, email_error='The email you entered does not match any account.', password_error='')
			elif bcrypt.hashpw(password.encode('utf-8'), user["salt"]) != user["password"]:
				self.render("login.html", email=email, email_error='', password_error='The password you entered is incorrect.')
			else:
				self.set_secure_cookie("auth_id", str(user["_id"]), httponly=True)
				self.redirect("/feed")

# handler for logging users out
class LogoutHandler(BaseHandler):
	def post(self):
		self.clear_cookie("auth_id")
		self.redirect("/login")

# handler for displaying a user's profile page
class ProfileHandler(BaseHandler):
	@tornado.gen.coroutine
	def get(self, user_id):
		try:
			user_id = ObjectId(user_id)
		except:
			self.redirect("/")
		else:
			target_user = yield self.application.db.users.find_one({"_id": user_id}, {"username_search": 0, "email": 0, "topics": 0, "password": 0, "salt": 0})
			if not target_user:
				if self.current_user:
					self.redirect("/feed")
				else:
					self.redirect("/")
			else:
				own_profile = self.current_user and self.current_user["_id"] == user_id

				ret = yield [self.application.db.questions.find({"asker": user_id}, {"date": 0, "asker": 0, "topics": 0, "question_search": 0}).sort("_id", -1).to_list(18),
							 self.application.db.votes.find({"user_id": user_id}, {"_id": 0}).sort("_id", -1).to_list(18),
							 self.application.db.followers.find_one({"user_id": user_id}, {"_id": 0}),
							 self.application.db.following.find_one({"user_id": user_id}, {"_id": 0}),]

				questions, votes, user_followers, user_following = ret

				question_count       = target_user.get("question_count", 0)
				following_this_user  = self.current_user and user_followers and self.current_user["_id"] in user_followers["followers"]
				user_followers_count = user_following_count = 0
				if user_followers:
					user_followers_count = user_followers["count"]
				if user_following:
					user_following_count = user_following["count"]

				recent_answers = answered_questions = None
				if votes:
					answered_questions = yield self.application.db.questions.find({"_id": {"$in": [vote["question_id"] for vote in votes[0]["votes"]]}}).to_list(None)
					recent_answers     = [v["vote_index"] for q in answered_questions for v in votes[0]["votes"] if q["_id"] == v["question_id"]]

				self.render("user_profile.html", profile=target_user, own_profile=own_profile, following_this_user=following_this_user, recent_answers=recent_answers,
					 							 answered_questions=answered_questions, questions=questions, question_count=question_count, user_following_count=user_following_count,
					 							 user_followers_count=user_followers_count)

def add_notification(user, link, image, notif, current_time):
	if user:
		user_notifs = user.get("notifications", [])
		user_notifs.append([False, link, image, notif, current_time])
		if len(user_notifs) > 200:
			user_notifs = user_notifs[100:]

		return user_notifs

class NotificationsHandler(BaseHandler):
	@tornado.gen.coroutine
	def post(self):
		if not self.current_user:
			self.write({"redirect": "/login"})
		else:
			user_notifs = self.current_user.get("notifications", [])
			for notif in user_notifs:
				notif[0] = True

			self.application.db.users.update({"_id": self.current_user["_id"]}, {"$set": {"notifications": user_notifs}})

# handler to follow or hate a user
class FollowHateHandler(BaseHandler):
	@tornado.gen.coroutine
	def post(self, target_id):
		if not self.current_user:
			self.write({"redirect": "/login"})
		else:
			try:
				target_id = ObjectId(target_id)
			except:
				self.write({"redirect", "/"})
			else:
				if self.get_argument("action") == "follow":
					if (yield self.application.db.followers.find_one({"user_id": target_id, "followers": self.current_user["_id"]}, fields={"_id": 1})):
						ret = yield [self.application.db.followers.find_and_modify({"user_id": target_id}, {"$inc": {"count": -1}, "$pull": {"followers": self.current_user["_id"]}}, fields={"_id": 0, "count": 1}, new=True),
								     self.application.db.following.update({"user_id": self.current_user["_id"]}, {"$inc": {"count": -1}, "$pull": {"following": target_id}})]
						self.write({"followers": ret[0]["count"], "display_text": "Follow"})
					else:
						ret = yield [self.application.db.followers.find_and_modify({"user_id": target_id}, {"$inc": {"count": 1}, "$addToSet": {"followers": self.current_user["_id"]}}, fields={"_id": 0, "count": 1}, upsert=True, new=True),
								     self.application.db.following.update({"user_id": self.current_user["_id"]}, {"$inc": {"count": 1}, "$addToSet": {"following": target_id}}, upsert=True)]
						
						user        = yield self.application.db.users.find_one({"_id": target_id}, fields={"notifications": 1})
						user_notifs = add_notification(user, "/users/" + str(self.current_user["_id"]), self.current_user["profile_pic_link"], self.current_user["username"] + ' started following you.', datetime.utcnow())
						self.application.db.users.update({"_id": target_id}, {"$set": {"notifications": user_notifs}})
						self.write({"followers": ret[0]["count"], "display_text": "Following"})
				else:
					if (yield self.application.db.haters.find_one({"user_id": target_id, "haters": self.current_user["_id"]}, fields={"_id": 1})):
						ret = yield [self.application.db.haters.find_and_modify({"user_id": target_id}, {"$inc": {"count": -1}, "$pull": {"haters": self.current_user["_id"]}}, fields={"_id": 0, "count": 1}, new=True),
						             self.application.db.hating.update({"user_id": self.current_user["_id"]}, {"$inc": {"count": -1}, "$pull": {"hating": target_id}})]
						self.write({"haters": ret[0]["count"], "display_text": "Hate"})
					else:
						ret = yield [self.application.db.haters.find_and_modify({"user_id": target_id}, {"$inc": {"count": 1}, "$addToSet": {"haters": self.current_user["_id"]}}, fields={"_id": 0, "count": 1}, upsert=True, new=True),
						             self.application.db.hating.update({"user_id": self.current_user["_id"]}, {"$inc": {"count": 1}, "$addToSet": {"hating": target_id}}, upsert=True)]
						self.write({"haters": ret[0]["count"], "display_text": "Hating"})

# handler to display a user's followers
class GetRelationshipsHandler(BaseHandler):
	@tornado.gen.coroutine
	def get(self, target_id):
		try:
			target_id = ObjectId(target_id)
		except:
			self.redirect("/")
		else:
			relation  = self.get_argument("relationship")
			if relation == "follower":
				relation_list = yield self.application.db.followers.find_one({"user_id": target_id}, {"_id": 0, "followers": 1})
				if relation_list:
					relation_list = yield self.application.db.users.find({"_id": {"$in": relation_list["followers"]}}, {"username": 1, "profile_pic_link": 1}).to_list(20)
			elif relation == "following":
				relation_list = yield self.application.db.following.find_one({"user_id": target_id}, {"_id": 0, "following": 1})
				if relation_list:
					relation_list = yield self.application.db.users.find({"_id": {"$in": relation_list["following"]}}, {"username": 1, "profile_pic_link": 1}).to_list(20)
			else:
				relation_list = yield self.application.db.haters.find_one({"user_id": target_id}, {"_id": 0, "haters": 1})
				if relation_list:
					relation_list = yield self.application.db.users.find({"_id": {"$in": relation_list["haters"]}}, {"username": 1, "profile_pic_link": 1}).to_list(20)

			if relation_list:
				for user in relation_list:
					user["_id"] = str(user["_id"])

			self.render("relationship.html", relation_list=relation_list, relation=relation)

# handler for user to modify account settings
class SettingsHandler(BaseHandler):
	def get(self):
		# redirect user to login page if not logged in
		if not self.current_user:
			self.redirect("/login")
		else:
			self.render("settings.html", current_user=self.current_user)

	# command indicates which field the user wants to modify
	# AJAX response with an error message if user sends invalid parameters
	@tornado.gen.coroutine
	def post(self, command):
		if not self.current_user:
			self.redirect("/login")
		else:
			if command == "updatePicture":
				new_picture = self.get_argument("profile-picture")
				# check if link is an actual image format using imghdr
				http_client = tornado.httpclient.AsyncHTTPClient()
				response    = yield http_client.fetch(new_picture)
				if not imghdr.what(response.buffer):
					self.write({"error": "You must enter a link to an image."})
				else:
					yield self.application.db.users.update({"_id": self.current_user["_id"]}, {"$set": {"profile_pic_link": new_picture}})

			elif command == "updateUsername":		
				new_username = self.get_argument("username")
				if len(new_username) < 6 or len(new_username) > 25:
					self.write({"error": "Your username must be between 6 and 25 characters long."})
				elif re.compile("^[a-zA-Z0-9_. ]+$").match(new_username) == None:
					self.write({"error": "Your username can only contain letters, numbers, spaces, and underscores."})
				else:
					yield self.application.db.users.update({"_id": self.current_user["_id"]}, {"$set": {"username": new_username, "username_search": new_username.lower()}})

			# bio is limited to 140 characters
			elif command == "updateBio":
				new_bio = self.get_argument("bio")[:140]
				yield self.application.db.users.update({"_id": self.current_user["_id"]}, {"$set": {"bio": new_bio}})

			elif command == "updateEmail":
				new_email = self.get_argument("email")
				if new_email == self.current_user["email"]:
					pass
				elif re.compile("^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$").match(new_email) == None:
					self.write({"error": "That is not a valid email address."})
				elif (yield self.application.db.users.find_one({"email": new_email})) != None:
					self.write({"error": "An account is already registered with that email address."})
				else:
					yield self.application.db.users.update({"_id": self.current_user["_id"]}, {"$set": {"email": new_email}})

			elif command == "updatePassword":
				old_password = self.get_argument("old-password")
				new_password = self.get_argument("new-password")

				if (len(new_password) < 6):
					self.write({"error": "Your new password must contain at least 6 characters."})
				else:
					user = yield self.application.db.users.find_one({"_id": self.current_user["_id"]}, {"salt": 1, "password": 1})
					if user == None:
						self.redirect("/")
					else:
						if bcrypt.hashpw(old_password.encode('utf-8'), user["salt"]) != user["password"]:
							self.write({"error": "The password you entered was incorrect."})
						else:
							salt     = bcrypt.gensalt()
							password = bcrypt.hashpw(new_password.encode('utf-8'), salt)
							yield self.application.db.users.update({"_id": self.current_user["_id"]}, {"$set": {"password": password, "salt": salt}})

			elif command == "updateURL":
				custom_url = self.get_argument("custom-url")
				if 1 <= len(custom_url) < 6:
					self.write({"error": "Your custom URL must contain at least 6 characters."})
				elif custom_url != '' and re.compile("^[a-zA-Z0-9_]+$").match(custom_url) == None:
					self.write({"error": "Your custom URL can only contain letters, numbers, and underscores."})
				# some URLS are off-limits
				elif custom_url in {"feed", "login", "logout", "signup", "settings", "email_lookup", "users", "follow_or_hate", "questions", "comments", "favorite_or_share", "vote", "create_question", "add_topic", "topics", "favorites", "search"}:
					self.write({"error": "Sorry, but that custom URL is not allowed."})
				else:
					if custom_url == '':
						yield self.application.db.users.update({"_id": self.current_user["_id"]}, {"$set": {"custom_url": custom_url}})
						return

					found_user = yield self.application.db.users.find_one({"custom_url": custom_url}, {"custom_url": 1})
					if found_user and found_user["_id"] != self.current_user["_id"]:
						self.write({"error": "Sorry, but someone else is already using that custom URL."})
					elif found_user and found_user["_id"] == self.current_user["_id"]:
						pass
					else:
						yield self.application.db.users.update({"_id": self.current_user["_id"]}, {"$set": {"custom_url": custom_url}})

			else:
				pass

# handler for user to create a question
class CreateQuestionHandler(BaseHandler):
	@tornado.gen.coroutine
	def post(self):
		# redirect user to login page if not logged in 
		if not self.current_user:
			self.write({"redirect": "/login"})
		else:
			question_title = self.get_argument("question-title")
			image_link     = self.get_argument("image-link")
			choices        = set([self.get_argument("choice-" + x) for x in 'abcde']) - set([''])
			topics         = self.get_argument("topics")

			# check for errors in question
			http_client = tornado.httpclient.AsyncHTTPClient()
			if question_title == '':
				self.write({"title_error": "Please enter a title for your question."})
			elif len(question_title) > 140:
				self.write({"title_error": "Question titles must be 120 characters or less."})
			elif len(choices) < 2:
				self.write({"choice_error": "Please enter at least 2 different choices."})
			elif not all(len(choice) <= 40 for choice in list(choices)):
				self.write({"choice_error": "Choices must be 40 characters or less."})
			elif not topics:
				self.write({"topics_error": "Please enter at least 1 topic."})
			elif re.compile("^[a-zA-Z0-9 \-]+$").match(topics) == None:
				self.write({"topics_error": "Topics can only contain letters, numbers, and hyphens."})
			elif not imghdr.what((yield http_client.fetch(image_link)).buffer):
				self.write({"image_error": "Please enter a link to an image."})
			else:
				topics = topics.lower().split(' ')[:10]
				if not all(len(topic) <= 40 for topic in list(topics)):
					self.write({"topics_error": "Each topic must be 40 characters or less."})
				else:
					data = [{'label': label, 'votes': 0} for label in choices]

					ret = yield [self.application.db.questions.insert({"asker": self.current_user["_id"], "question": question_title, "question_search": question_title.lower(), "date": datetime.utcnow(), "image_link": image_link, "data": data, "topics": topics}),
								 self.application.db.users.update({"_id": self.current_user["_id"]}, {"$inc": {"question_count": 1}}, fields={"question_count": 1})]

					question = ret[0]

					if len(topics) == 1:
						ret = yield self.application.db.topics.find_and_modify({"name": topics[0]}, {"$inc": {"question_count": 1}}, upsert=True)
						if not ret:
							yield self.application.db.topics.update({"name": topics[0]}, {"$set": {"name_search": topics[0].lower(), "created_by": self.current_user["_id"], "creation_date": datetime.utcnow()}})
					else:
						for topic in topics:
							topics_subset = set(topics) - set([topic])
							update_dict   = {"related_topics." + related_topic: 1 for related_topic in topics_subset}
							update_dict["question_count"] = 1
							ret = yield self.application.db.topics.find_and_modify({"name": topic}, {"$inc": update_dict}, upsert=True)
							if not ret:
								yield self.application.db.topics.update({"name": topic}, {"$set": {"name_search": topic.lower(), "created_by": self.current_user["_id"], "creation_date": datetime.utcnow()}})

					self.write({"redirect": "/questions/" + str(question)})

# handler to display individual question page
class QuestionHandler(BaseHandler):
	@tornado.gen.coroutine
	def get(self, question_id):
		try:
			question_id = ObjectId(question_id)
		except:
			self.redirect("/")
		else:
			question = yield self.application.db.questions.find_one({"_id": question_id})
			if not question:
				self.redirect("/")
			else:
				if self.current_user:
					db_favorites, db_comments, asker, vote = yield [self.application.db.favorites.find_one({"question_id": question_id}),
																    self.application.db.comments.find_one({"question_id": question_id}),
																    self.application.db.users.find_one({"_id": question["asker"]}, {"email": 0, "bio": 0, "password": 0, "salt": 0}),
																    self.application.db.votes.find_one({"user_id": self.current_user["_id"], "votes.question_id": question_id}, {"_id": 0, "votes.$.vote_index": 1})]
				else:
					vote = None
					db_favorites, db_comments, asker = yield [self.application.db.favorites.find_one({"question_id": question_id}),
														      self.application.db.comments.find_one({"question_id": question_id}),
														      self.application.db.users.find_one({"_id": question["asker"]}, {"email": 0, "bio": 0, "password": 0, "salt": 0})]
				
				if not asker:
					self.redirect("/")

				commenters = None
				if db_comments:
					commenters = []
					# get 50 most recent comments
					db_comments["comments"] = db_comments["comments"][-50:]
					unsorted_commenters     = yield self.application.db.users.find({"_id": {"$in": [comment["user_id"] for comment in db_comments["comments"]]}}, {"password": 0, "salt": 0, "email": 0, "bio": 0}).to_list(50)
					commenters              = [commenter for comment in db_comments["comments"] for commenter in unsorted_commenters if commenter["_id"] == comment["user_id"]]

				favorited_this_question = self.current_user and db_favorites and self.current_user["_id"] in db_favorites["user_ids"]
				favorite_count          = 0
				if db_favorites:
					favorite_count = db_favorites["count"]

				comment_count = 0
				comments      = None
				if db_comments:
					comment_count = db_comments["count"]
					comments      = db_comments["comments"]

				if vote:
					vote = vote["votes"][0]['vote_index']

				self.render("question.html", current_user=self.current_user, asker=asker, question=question, vote=vote, favorite_count=favorite_count, favorited_this_question=favorited_this_question,
											 comment_count=comment_count, comments=comments, commenters=commenters, datetime=datetime)

# module to render a question card
class QuestionModule(tornado.web.UIModule):
	def render(self, asker, question, vote, favorite_count, favorited_this_question, comment_count):
		return self.render_string("question_module.html", asker=asker, question=question, vote=vote, favorite_count=favorite_count, favorited_this_question=favorited_this_question,
											              comment_count=comment_count, datetime=datetime, json=json)

	def css_files(self):
		return self.handler.static_url("css/question_module.css")

	def javascript_files(self):
		return self.handler.static_url("js/question_module.js")

# handler for viewing/adding comments to a question
class CommentHandler(BaseHandler):
	@tornado.gen.coroutine
	def get(self, question_id):
		try:
			question_id = ObjectId(question_id)
		except:
			self.redirect("/")
		else:
			comments = yield self.application.db.comments.find_one({"question_id": question_id}, fields={"_id": 0, "comments": 1})
			if comments:
				comments   = comments["comments"][-50:]
				user_list  = yield self.application.db.users.find({"_id": {"$in": [comment["user_id"] for comment in comments]}}, {"password": 0, "salt": 0, "email": 0, "bio": 0}).to_list(50)	
				commenters = [user for comment in comments for user in user_list if user["_id"] == comment["user_id"]]

				self.render("comment_module.html", question_id=question_id, comments=comments, commenters=commenters, datetime=datetime)
			
			else:
				self.render("comment_module.html", question_id=question_id, comments=None, commenters=None, datetime=datetime)

	@tornado.gen.coroutine
	def post(self, question_id):
		if not self.current_user:
			self.write({"redirect": "/login"})
		else:
			try:
				question_id = ObjectId(question_id)
			except:
				self.write({"redirect": "/login"})
			else:
				comment  = self.get_argument("comment")
				comments = yield self.application.db.comments.find_and_modify(
						{"question_id": question_id},
						{"$inc": {"count": 1}, "$push": {"comments": {"user_id": self.current_user["_id"], "date": datetime.utcnow(), "comment": comment}}},
						fields={"_id": 0},
						upsert=True,
						new=True
					)

				# get list of all users that have left a comment
				count      = comments["count"]
				comments   = comments["comments"][-50:]
				user_list  = yield self.application.db.users.find({"_id": {"$in": [comment["user_id"] for comment in comments]}}, {"password": 0, "salt": 0, "email": 0, "bio": 0}).to_list(50)	
				commenters = [user for comment in comments for user in user_list if user["_id"] == comment["user_id"]]

				self.write({"count": count, "replacement": str(self.render_string("comment_module.html", question_id=question_id, comments=comments, commenters=commenters, datetime=datetime), "utf-8")})

				question = yield self.application.db.questions.find_one({"_id": question_id}, {"asker": 1, "question": 1})
				if question["asker"] != self.current_user["_id"]:
					user = yield self.application.db.users.find_one({"_id": question["asker"]}, fields={"notifications": 1})
					user_notifs = add_notification(user, "/questions/" + str(question["_id"]), self.current_user["profile_pic_link"], self.current_user["username"] + ' left a comment on "' + question["question"] + '".', datetime.utcnow())
					self.application.db.users.update({"_id": question["asker"]}, {"$set": {"notifications": user_notifs}})

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
	def post(self, question_id):
		if not self.current_user:
			self.write({"redirect": "/login"})
		else:
			try:
				question_id = ObjectId(question_id)
			except:
				self.write({"redirect": "/"})
			else:
				vote_index  = int(self.get_argument("vote_index"))

				# user has already voted on this question
				removed_vote = False
				if (yield self.application.db.votes.find_one({"user_id": self.current_user["_id"], "votes.question_id": question_id})):
					user_vote = yield self.application.db.votes.find_and_modify(
							{"user_id": self.current_user["_id"], "votes.question_id": question_id},
							{"$set": {"votes.$.vote_index": vote_index}},
							fields={"_id": 0, "votes": 1}
						)

					for vote_entry in user_vote["votes"]:
						if vote_entry["question_id"] == question_id:
							old_vote = vote_entry["vote_index"]
							break
					
					# if user votes on same choice, then remove the user's vote
					if old_vote == vote_index:
						for idx, vote_entry in enumerate(user_vote["votes"][:]):
							if vote_entry["question_id"] == question_id:
								del user_vote["votes"][idx]
								break

						ret = yield [self.application.db.votes.update({"user_id": self.current_user["_id"]},{"$set": {"votes": user_vote["votes"]}}),
									 self.application.db.questions.find_and_modify({"_id": question_id}, {"$inc": {"data."+str(old_vote)+".votes": -1, "data."+str(vote_index)+".votes": -1}}, new=True)]

						question_data = ret[1]["data"]
						removed_vote  = True

					else:
						question_data = (yield self.application.db.questions.find_and_modify(
								{"_id": question_id},
								{"$inc": {"data."+str(old_vote)+".votes": -1, "data."+str(vote_index)+".votes": 1}},
								fields={"_id": 0, "data": 1},
								new=True))["data"]
				
				# user has not voted on this question
				else:
					ret = yield [self.application.db.votes.update({"user_id": self.current_user["_id"]}, {"$addToSet": {"votes": {"question_id": question_id, "vote_index": vote_index}}}, upsert=True),
							     self.application.db.questions.find_and_modify({"_id": question_id}, {"$inc": {"data."+str(vote_index)+".votes": 1}}, fields={"_id": 0, "data": 1}, new=True)]

					question_data = ret[1]["data"]

				vote_count = sum([data["votes"] for data in question_data])
				if vote_count == 0:
					vote_percentages = [0 for data in question_data]
				else:
					vote_percentages = [data["votes"] * 100/vote_count for data in question_data]
					
				if 1000 <= vote_count <= 999999:
					vote_count = str(round(vote_count/1000, 1)) + 'K'
				elif 1000000 < vote_count:
					vote_count = str(round(vote_count/1000000, 1)) + 'M'

				self.write({"removed_vote": removed_vote, "idx": vote_index, "votes": vote_count, "percentages": vote_percentages})

# handler for favoriting or sharing a question
class FavoriteShareHandler(BaseHandler):
	@tornado.gen.coroutine
	def post(self, question_id):
		if not self.current_user:
			self.write({"redirect": "/login"})
		else:
			try:
				question_id = ObjectId(question_id)
			except:
				self.write({"redirect": "/"})
			else:
				action = self.get_argument("action")
				if action == "favorite":
					action_list = yield self.application.db.favorites.find_one({"question_id": question_id}, fields={"asker": 1, "user_ids": 1})
					action_db   = self.application.db.favorites
				else:
					action_list = yield self.application.db.shares.find_one({"question_id": question_id}, fields={"asker": 1, "user_ids": 1})
					action_db   = self.application.db.shares

				# first user to favorite or share this question
				if not action_list:
					self.write({action: True, "count": 1})
					question = yield self.application.db.questions.find_one({"_id": question_id}, {"question": 1, "asker": 1})
					if question["asker"] != self.current_user["_id"]:
						ret = yield [action_db.update({"question_id": question_id}, {"$inc": {"count": 1}, "$addToSet": {"user_ids": self.current_user["_id"]}}, upsert=True),
					                 self.application.db.users.find_one({"_id": question["asker"]}, fields={"notifications": 1})]
						user_notifs = add_notification(ret[1], "/users/" + str(self.current_user["_id"]), self.current_user["profile_pic_link"], self.current_user["username"] + ' added "' + question["question"] + '" to their favorites.', datetime.utcnow())
						self.application.db.users.update({"_id": question["asker"]}, {"$set": {"notifications": user_notifs}})
					else:
						action_db.update({"question_id": question_id}, {"$inc": {"count": 1}, "$addToSet": {"user_ids": self.current_user["_id"]}}, upsert=True)
				# not the first
				else:
					if self.current_user["_id"] in action_list["user_ids"]:
						action_list = yield action_db.find_and_modify(
								{"question_id": question_id},
								{"$inc": {"count": -1}, "$pull": {"user_ids": self.current_user["_id"]}},
								fields={"count": 1},
								new=True)

						if action_list["count"] < 1000:
							count = action_list["count"]
						elif action_list["count"] <= 999999:
							count = str(round(action_list["count"])/1000, 1) + 'K'
						else:
							count = str(round(action_list["count"])/1000000, 1) + 'M'

						self.write({action: False, "count": count})

					else:
						action_list = yield action_db.find_and_modify(
								{"question_id": question_id},
								{"$inc": {"count": 1}, "$push": {"user_ids": self.current_user["_id"]}},
								fields={"count": 1},
								new=True)

						if action_list["count"] <= 1000:
							count = action_list["count"]
						elif action_list["count"] <= 999999:
							count = str(round(action_list["count"])/1000, 1) + 'K'
						else:
							count = str(round(action_list["count"])/1000000, 1) + 'M'

						self.write({action: True, "count": count})

						question = yield self.application.db.questions.find_one({"_id": question_id}, {"question": 1, "asker": 1})
						if question["asker"] != self.current_user["_id"]:
							user = yield self.application.db.users.find_one({"_id": question["asker"]}, fields={"notifications": 1})
							user_notifs = add_notification(user, "/users/" + str(self.current_user["_id"]), self.current_user["profile_pic_link"], self.current_user["username"] + ' added "' + question["question"] + '" to their favorites.', datetime.utcnow())
							self.application.db.users.update({"_id": question["asker"]}, {"$set": {"notifications": user_notifs}})

# handler for the home page
class IndexHandler(BaseHandler):
	# redirect to /feed if already logged in
	@tornado.gen.coroutine
	def get(self):
		self.redirect('/signup')
		return
		if self.current_user:
			self.redirect("/feed")
		else:
			questions, groups = yield [self.application.db.questions.find().sort("_id", 1).to_list(10),
									   self.application.db.groups.find().to_list(3)]

			votes_temp = None
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

			self.render("index.html", askers=askers, questions=questions, groups=groups, votes=votes, favorites=favorites, shares=shares, comments=comments, controlled=False,)

# processes bulk amount of questions for general newsfeed, favorite feed, and topic feed
def process_questions(current_user, questions, favorites, comments, askers_temp, votes_temp):
	favorited_this_question = []
	favorite_count          = []
	comment_count           = []
	askers                  = []
	votes                   = []
	for question in questions:
		favorited = False
		count     = 0
		if favorites:
			for favorite in favorites:
				if question["_id"] == favorite["question_id"]:
					count = favorite["count"]
					if current_user and current_user["_id"] in favorite["user_ids"]:
						favorited = True
					break
		favorited_this_question.append(favorited)
		favorite_count.append(count)

		count = 0
		if comments:
			for comment in comments:
				if question["_id"] == comment["question_id"]:
					count = comment["count"]
					break
		comment_count.append(count)

		for asker in askers_temp:
			if asker["_id"] == question["asker"]:
				askers.append(asker)

		vote_index = None
		if votes_temp:
			for vote in votes_temp["votes"]:
				if question["_id"] == vote["question_id"]:
					vote_index = vote["vote_index"]
					break
		votes.append(vote_index)

	return favorited_this_question, favorite_count, comment_count, askers, votes

# handler for displaying a user's personalized newsfeed
class FeedHandler(BaseHandler):
	@tornado.gen.coroutine
	def get(self):
		if not self.current_user:
			self.redirect("/")
		else:
			topics    = self.current_user.get("topics", [])
			following = yield self.application.db.following.find({"user_id": self.current_user["_id"]}, {"following": 1}).to_list(None)
			if following:
				following = following[0].get("following", [])

			days      = 7
			time_span = datetime.utcnow() - timedelta(days=days)
			if topics or following:
				questions = yield self.application.db.questions.find({"$or": [{"$and": [{"date": {"$gte": time_span}}, {"asker": {"$in": following + [self.current_user["_id"]]}}]}, {"topics": {"$in": topics}}]}).to_list(50)
			else:
				questions = yield self.application.db.questions.find({"date": {"$gt": time_span}}).to_list(50)

			searches = 0
			while not questions or len(questions) < 50 and searches < 10:
				days      = days + 14
				old_span  = time_span
				time_span = datetime.utcnow() - timedelta(days=days)
				if topics or following:
					more_qs = yield self.application.db.questions.find({"$or": [{"$and": [{"date": {"$gte": time_span, "$lt": old_span}}, {"asker": {"$in": following + [self.current_user["_id"]]}}]}, {"topics": {"$in": topics}}]}).to_list(50 - len(questions))
				else:
					more_qs = yield self.application.db.questions.find({"date": {"$gt": time_span}}).to_list(50 - len(questions))

				if more_qs:
					if not questions:
						questions = more_qs
					else:
						for q in more_qs:
							if not q in questions:
								questions.append(q)
				searches = searches + 1

			if questions:
				questions.sort(key=lambda question: sum([q["votes"] for q in question["data"]]), reverse=True)

			ret = yield [self.application.db.favorites.find({"question_id": {"$in": [question["_id"] for question in questions]}}).to_list(50),
						 self.application.db.comments.find({"question_id": {"$in": [question["_id"] for question in questions]}}).to_list(50),
						 self.application.db.users.find({"_id": {"$in": [question["asker"] for question in questions]}}, {"email": 0, "bio": 0, "password": 0, "salt": 0}).to_list(50),
						 self.application.db.votes.find_one({"user_id": self.current_user["_id"]})]

			favorited_this_question, favorite_count, comment_count, askers, votes = process_questions(self.current_user, questions, *ret)

			self.render("newsfeed.html", current_user=self.current_user, title='Feed', topic=False, following_topic=False, selection='Top', askers=askers, questions=questions,
										 favorite_count=favorite_count, favorited_this_question=favorited_this_question, comment_count=comment_count, votes=votes)

class RecentFeedHandler(BaseHandler):
	@tornado.gen.coroutine
	def get(self):
		if not self.current_user:

			self.redirect("/")
		else:
			topics    = self.current_user.get("topics", [])
			following = yield self.application.db.following.find({"user_id": self.current_user["_id"]}, {"following": 1}).to_list(None)
			if following:
				following = following[0].get("following", [])

			days      = 7
			time_span = datetime.utcnow() - timedelta(days=days)
			if topics or following:
				questions = yield self.application.db.questions.find({"$or": [{"$and": [{"date": {"$gte": time_span}}, {"asker": {"$in": following + [self.current_user["_id"]]}}]}, {"topics": {"$in": topics}}]}).to_list(50)
			else:
				questions = yield self.application.db.questions.find({"date": {"$gt": time_span}}).to_list(50 - len(questions))

			searches  = 0
			while not questions or len(questions) < 50 and searches < 10:
				days      = days + 14
				old_span  = time_span
				time_span = datetime.utcnow() - timedelta(days=days)
				if topics or following:
					more_qs = yield self.application.db.questions.find({"$or": [{"$and": [{"date": {"$gte": time_span}}, {"asker": {"$in": following + [self.current_user["_id"]]}}]}, {"topics": {"$in": topics}}]}).to_list(50)
				else:
					more_qs = yield self.application.db.questions.find({"date": {"$gt": time_span}}).to_list(50)
				
				if more_qs:
					if not questions:
						questions = more_qs
					else:
						for q in more_qs:
							if not q in questions:
								questions.append(q)
				searches = searches + 1

			if questions:
				questions.sort(key=lambda question: question["date"], reverse=True)

			ret = yield [self.application.db.favorites.find({"question_id": {"$in": [question["_id"] for question in questions]}}).to_list(50),
						 self.application.db.comments.find({"question_id": {"$in": [question["_id"] for question in questions]}}).to_list(50),
						 self.application.db.users.find({"_id": {"$in": [question["asker"] for question in questions]}}, {"email": 0, "bio": 0, "password": 0, "salt": 0}).to_list(50),
						 self.application.db.votes.find_one({"user_id": self.current_user["_id"]})]

			favorited_this_question, favorite_count, comment_count, askers, votes = process_questions(self.current_user, questions, *ret)

			self.render("newsfeed.html", current_user=self.current_user, title='Feed', topic=False, following_topic=False, selection='Recent', askers=askers, questions=questions,
										 favorite_count=favorite_count, favorited_this_question=favorited_this_question, comment_count=comment_count, votes=votes)

# handler for displaying a user's favorited questions
class FavoritesHandler(BaseHandler):
	@tornado.gen.coroutine
	def get(self):
		if not self.current_user:
			self.redirect("/")
		else:
			favorited = yield self.application.db.favorites.find({"user_ids": self.current_user["_id"]}, {"_id": 0, "question_id": 1}).to_list(None)
			questions = yield self.application.db.questions.find({"_id": {"$in": [fav["question_id"] for fav in favorited]}}).to_list(None)

			if questions:
				questions.sort(key=lambda question: sum([q["votes"] for q in question["data"]]), reverse=True)

			ret = yield [self.application.db.favorites.find({"question_id": {"$in": [question["_id"] for question in questions]}}).to_list(None),
						 self.application.db.comments.find({"question_id": {"$in": [question["_id"] for question in questions]}}).to_list(None),
						 self.application.db.users.find({"_id": {"$in": [question["asker"] for question in questions]}}, {"email": 0, "bio": 0, "password": 0, "salt": 0}).to_list(None),
						 self.application.db.votes.find_one({"user_id": self.current_user["_id"]})]

			favorited_this_question, favorite_count, comment_count, askers, votes = process_questions(self.current_user, questions, *ret)

			self.render("newsfeed.html", current_user=self.current_user, title='Favorites', topic=False, following_topic=False, selection='Top', askers=askers, questions=questions,
										 favorite_count=favorite_count, favorited_this_question=favorited_this_question, comment_count=comment_count, votes=votes)

class RecentFavoritesHandler(BaseHandler):
	@tornado.gen.coroutine
	def get(self):
		if not self.current_user:
			self.redirect("/")
		else:
			favorited = yield self.application.db.favorites.find({"user_ids": self.current_user["_id"]}, {"_id": 0, "question_id": 1}).to_list(None)
			questions = yield self.application.db.questions.find({"_id": {"$in": [fav["question_id"] for fav in favorited]}}).to_list(None)

			if questions:
				questions.sort(key=lambda question: question["date"], reverse=True)

			ret = yield [self.application.db.favorites.find({"question_id": {"$in": [question["_id"] for question in questions]}}).to_list(None),
						 self.application.db.comments.find({"question_id": {"$in": [question["_id"] for question in questions]}}).to_list(None),
						 self.application.db.users.find({"_id": {"$in": [question["asker"] for question in questions]}}, {"email": 0, "bio": 0, "password": 0, "salt": 0}).to_list(None),
						 self.application.db.votes.find_one({"user_id": self.current_user["_id"]})]

			favorited_this_question, favorite_count, comment_count, askers, votes = process_questions(self.current_user, questions, *ret)

			self.render("newsfeed.html", current_user=self.current_user, title='Favorites', topic=False, following_topic=False, selection='Recent', askers=askers, questions=questions,
										 favorite_count=favorite_count, favorited_this_question=favorited_this_question, comment_count=comment_count, votes=votes)

# handler for displaying questions of a specific topic
class TopicHandler(BaseHandler):
	@tornado.gen.coroutine
	def get(self, topic_name):
		if not (yield self.application.db.topics.find_one({"name_search": topic_name.lower()})):
			self.redirect("/")

		days       = 7
		time_span  = datetime.utcnow() - timedelta(days=days)
		questions  = yield self.application.db.questions.find({"topics": topic_name, "date": {"$gte": time_span}}).to_list(50)

		searches = 0
		while len(questions) < 50 and searches < 10:
			days      = days + 14
			old_span  = time_span
			time_span = datetime.utcnow() - timedelta(days=days)
			more_qs   = yield self.application.db.questions.find({"topics": topic_name, "date": {"$gte": time_span, "$lt": old_span}}).to_list(50 - len(questions))
			if more_qs:
				if not questions:
					questions = more_qs
				else:
					for q in more_qs:
						if not q in questions:
							questions.append(q)
			searches  = searches + 1

		if questions:
			questions.sort(key=lambda question: sum([q["votes"] for q in question["data"]]), reverse=True)

		if self.current_user:
			*ret, topic = yield [self.application.db.favorites.find({"question_id": {"$in": [question["_id"] for question in questions]}}).to_list(50),
								 self.application.db.comments.find({"question_id": {"$in": [question["_id"] for question in questions]}}).to_list(50),
								 self.application.db.users.find({"_id": {"$in": [question["asker"] for question in questions]}}, {"email": 0, "bio": 0, "password": 0, "salt": 0}).to_list(50),
								 self.application.db.votes.find_one({"user_id": self.current_user["_id"]}),
								 self.application.db.topics.find_one({"name": topic_name}, {"created_by": 1, "question_count": 1, "follower_count": 1})]

			favorited_this_question, favorite_count, comment_count, askers, votes = process_questions(self.current_user, questions, *ret)
		else:
			*ret, topic = yield [self.application.db.favorites.find({"question_id": {"$in": [question["_id"] for question in questions]}}).to_list(50),
								 self.application.db.comments.find({"question_id": {"$in": [question["_id"] for question in questions]}}).to_list(50),
								 self.application.db.users.find({"_id": {"$in": [question["asker"] for question in questions]}}, {"email": 0, "bio": 0, "password": 0, "salt": 0}).to_list(50),
								 self.application.db.topics.find_one({"name": topic_name}, {"created_by": 1, "question_count": 1, "follower_count": 1})]

			favorited_this_question, favorite_count, comment_count, askers, votes = process_questions(self.current_user, questions, *ret, None)

		question_count, follower_count = topic.get("question_count", 0), topic.get("follower_count", 0)

		following_topic = False
		if self.current_user and (yield self.application.db.topics.find_one({"name": topic_name, "followers": self.current_user["_id"]}, {"_id": 1})):
			following_topic = True

		self.render("newsfeed.html", current_user=self.current_user, title=topic_name, topic=topic_name, following_topic=following_topic, selection='Top',
									 askers=askers, questions=questions, favorite_count=favorite_count, favorited_this_question=favorited_this_question,
									 comment_count=comment_count, votes=votes, topic_question_count=question_count, topic_follower_count=follower_count)

class RecentTopicHandler(BaseHandler):
	@tornado.gen.coroutine
	def get(self, topic_name):
		days       = 7
		time_span  = datetime.utcnow() - timedelta(days=days)
		questions  = yield self.application.db.questions.find({"topics": topic_name, "date": {"$gt": time_span}}).to_list(50)

		searches = 0
		while len(questions) < 50 and searches < 10:
			days      = days + 14
			old_span  = time_span
			time_span = datetime.utcnow() - timedelta(days=days)
			more_qs   = yield self.application.db.questions.find({"topics": topic_name, "date": {"$gt": time_span, "$lt": old_span}}).to_list(50 - len(questions))
			if more_qs:
				if not questions:
					questions = more_qs
				else:
					for q in more_qs:
						if not q in questions:
							questions.append(q)
			searches  = searches + 1

		if questions:
			questions.sort(key=lambda question: question["date"], reverse=True)

		if self.current_user:
			*ret, topic = yield [self.application.db.favorites.find({"question_id": {"$in": [question["_id"] for question in questions]}}).to_list(50),
								 self.application.db.comments.find({"question_id": {"$in": [question["_id"] for question in questions]}}).to_list(50),
								 self.application.db.users.find({"_id": {"$in": [question["asker"] for question in questions]}}, {"email": 0, "bio": 0, "password": 0, "salt": 0}).to_list(50),
								 self.application.db.votes.find_one({"user_id": self.current_user["_id"]}),
								 self.application.db.topics.find_one({"name": topic_name}, {"created_by": 1, "question_count": 1, "follower_count": 1})]

			favorited_this_question, favorite_count, comment_count, askers, votes = process_questions(self.current_user, questions, *ret)
		else:
			*ret, topic = yield [self.application.db.favorites.find({"question_id": {"$in": [question["_id"] for question in questions]}}).to_list(50),
								 self.application.db.comments.find({"question_id": {"$in": [question["_id"] for question in questions]}}).to_list(50),
								 self.application.db.users.find({"_id": {"$in": [question["asker"] for question in questions]}}, {"email": 0, "bio": 0, "password": 0, "salt": 0}).to_list(50),
								 self.application.db.topics.find_one({"name": topic_name}, {"created_by": 1, "question_count": 1, "follower_count": 1})]

			favorited_this_question, favorite_count, comment_count, askers, votes = process_questions(self.current_user, questions, *ret, None)

		question_count, follower_count = topic.get("question_count", 0), topic.get("follower_count", 0)

		following_topic = False
		if self.current_user and (yield self.application.db.topics.find_one({"name": topic_name, "followers": self.current_user["_id"]}, {"_id": 1})):
			following_topic = True

		self.render("newsfeed.html", current_user=self.current_user, title=topic_name, topic=topic_name, following_topic=following_topic, selection='Recent',
									 askers=askers, questions=questions, favorite_count=favorite_count, favorited_this_question=favorited_this_question,
									 comment_count=comment_count, votes=votes, topic_question_count=question_count, topic_follower_count=follower_count)

# handler to display a topic's followers
class GetTopicFollowersHandler(BaseHandler):
	@tornado.gen.coroutine
	def get(self, topic_name):
		topic_follower_ids = yield self.application.db.topics.find_one({"name": topic_name}, {"followers": 1})
		if not topic_follower_ids:
			self.redirect("/")

		topic_follower_ids = topic_follower_ids.get("followers", None)
		topic_followers    = yield self.application.db.users.find({"_id": {"$in": topic_follower_ids}}, {"username": 1, "profile_pic_link": 1}).to_list(20)

		self.render("relationship.html", relation_list=topic_followers, relation="follower")

# handler to add a topic to a user's feed
class AddTopicToFeed(BaseHandler):
	@tornado.gen.coroutine
	def post(self):
		if not self.current_user:
			self.write({"redirect": "/login"})
		else:
			# topic will be added to the user's feed only if the topic already exists
			topic_name = self.get_argument("topic-name")
			topic      = yield self.application.db.topics.find_one({"name": topic_name})
			if not topic:
				pass
			else:
				if self.current_user["_id"] in topic.get("followers", []):
					following          = False
					topic_data, unused = yield [self.application.db.topics.find_and_modify({"name": topic_name}, {"$inc": {"follower_count": -1}, "$pull": {"followers": self.current_user["_id"]}}, fields={"follower_count": 1}, new=True),
						   						self.application.db.users.find_and_modify({"_id": self.current_user["_id"]}, {"$pull": {"topics": topic_name}})]

				else:
					following          = True
					topic_data, unused = yield [self.application.db.topics.find_and_modify({"name": topic_name}, {"$inc": {"follower_count": 1}, "$addToSet": {"followers": self.current_user["_id"]}}, fields={"follower_count": 1}, new=True),
						   						self.application.db.users.find_and_modify({"_id": self.current_user["_id"]}, {"$addToSet": {"topics": topic_name}})]

				self.write({"name": topic_name, "count": topic_data["follower_count"], "following": following})

# handler to search for users, questions, or topics
class SearchHandler(BaseHandler):
	@tornado.gen.coroutine
	def get(self):
		search_term = self.get_argument("search-term", None)
		if search_term:
			search_term = search_term.lower()
			users, questions, topics = yield [self.application.db.users.find({"username_search": {"$regex": search_term}}, {"username": 1, "profile_pic_link": 1}).to_list(20),
				   		                      self.application.db.questions.find({"question_search": {"$regex": search_term}}, {"question": 1, "image_link": 1}).to_list(20),
				   		                      self.application.db.topics.find({"name_search": {"$regex": search_term}}, {"name": 1}).to_list(20)]
		else:
			users = questions = topics = None

		self.render("search.html", current_user=self.current_user, search_term=search_term, users=users, questions=questions, topics=topics)

class CustomURLHandler(BaseHandler):
	@tornado.gen.coroutine
	def get(self, custom_url):
		target_user = yield self.application.db.users.find_one({"custom_url": custom_url}, {"username_search": 0, "email": 0, "topics": 0, "password": 0, "salt": 0})
		if not target_user:
			if self.current_user:
				self.redirect("/feed")
			else:
				self.redirect("/")
		else:
			own_profile = self.current_user and self.current_user["_id"] == target_user["_id"]

			ret = yield [self.application.db.questions.find({"asker": target_user["_id"]}, {"date": 0, "asker": 0, "topics": 0, "question_search": 0}).sort("_id", -1).to_list(18),
						 self.application.db.votes.find({"user_id": target_user["_id"]}, {"_id": 0}).sort("_id", -1).to_list(18),
						 self.application.db.followers.find_one({"user_id": target_user["_id"]}, {"_id": 0}),
						 self.application.db.following.find_one({"user_id": target_user["_id"]}, {"_id": 0}),]

			questions, votes, user_followers, user_following = ret

			question_count       = target_user.get("question_count", 0)
			following_this_user  = self.current_user and user_followers and self.current_user["_id"] in user_followers["followers"]
			user_followers_count = user_following_count = 0
			if user_followers:
				user_followers_count = user_followers["count"]
			if user_following:
				user_following_count = user_following["count"]

			recent_answers = answered_questions = None
			if votes:
				answered_questions = yield self.application.db.questions.find({"_id": {"$in": [vote["question_id"] for vote in votes[0]["votes"]]}}).to_list(None)
				recent_answers     = [v["vote_index"] for q in answered_questions for v in votes[0]["votes"] if q["_id"] == v["question_id"]]

			self.render("user_profile.html", profile=target_user, own_profile=own_profile, following_this_user=following_this_user, recent_answers=recent_answers,
				 							 answered_questions=answered_questions, questions=questions, question_count=question_count, user_following_count=user_following_count,
				 							 user_followers_count=user_followers_count)

if __name__ == "__main__":
	tornado.options.parse_command_line()
	http_server = tornado.httpserver.HTTPServer(Application())
	http_server.listen((int(os.environ.get('PORT', 8000))))
	tornado.ioloop.IOLoop.instance().start()
