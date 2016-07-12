import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import pymongo
import logging
import os.path
import bcrypt
import re
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
					(r"/questions/(\w+)", QuestionHandler),
					(r"/comments/(\w+)", CommentHandler),
					(r"/favorite/(\w+)", FavoriteHandler),
					(r"/share/(\w+)", ShareHandler),
					(r"/create_question", CreateQuestionHandler),
		]
		settings = dict(
			template_path=os.path.join(os.path.dirname(__file__), "templates"),
			static_path=os.path.join(os.path.dirname(__file__), "static"),
			cookie_secret="bZJc2sWbQLKos6GkHn/VB9oXwQt8S0R0kRvJ5/xJ89E=",
			xsrf_cookies=True,
			login_url="/",
			debug=True,
		)
		client = pymongo.MongoClient("mongodb://mcurrie:practice@ds021884.mlab.com:21884/hive")
		client.drop_database("hive")
		self.db = client.hive
		users = self.db.users
		user  = users.insert_one({"username":         "BasedGod", 
								  "email":            "based@god.com",
								  "password":         b'$2b$12$y5gm/JA4Sbqahkuo4o.kX.27IisMTqvAEtSZrxVkJ9ZM.UWHQ476y',
								  "salt":			  b'$2b$12$y5gm/JA4Sbqahkuo4o.kX.',
								  "profile_pic_link": "http://i.imgur.com/MQam61S.jpg",
								  "questions":        2,
								  "answers":          58,
								  "following":        [],
								  "followers":        [],
								  "haters":           [],
								  "hating":			  [],
								  "favorites":		  [],
								  "shares":			  [],
								  "bio":              "Mogul, First Rapper Ever To Write And Publish A Book at 19, Film Score, Composer, Producer, Director #BASED"})

		questions = self.db.questions
		questions.insert_one({"asker":      "based@god.com",
							  "question":   "Whos gonna become president? no trolls pls",
							  "date":	    datetime.utcnow(),
					 		  "image_link": "http://i.imgur.com/l4PPTGC.jpg",
					 		  "labels":     ("hillary", "trump", "can obama get another term", "i hate them both"),
					 		  "data":       (63, 13, 300, 120),
					 		  "favorites":  1934,
					 		  "shares":     92903,
					 		  "comments":	[]})

		questions.insert_one({"asker":      "based@god.com",
							  "question":   "Rate Beyonces new album!",
							  "date":       datetime.utcnow(),
							  "image_link": "http://i.imgur.com/SX3tMDg.jpg",
							  "labels":     ("it was LIT", "shes done better", "worse than Miley"),
							  "data":       (12, 19, 3),
							  "favorites":  13203156,
							  "shares":     191931,
					 		  "comments":   [("based@god.com", datetime(2015, 4, 12, 0, 0, 0, 0), "not really feeling it"),
					 		  				 ("mcurrie1@umd.edu", datetime(2016, 4, 12, 0, 0, 0, 0), "7.568/10"),
					 		  				 ("mcurrie1@umd.edu", datetime(2016, 7, 11, 0, 0, 0, 0), "whatever man"),
					 		  				 ("based@god.com", datetime(2016, 7, 12, 0, 2, 23, 0), "yolo 2016")]})

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

class IndexHandler(BaseHandler):
	def get(self):
		if self.current_user:
			self.redirect("/feed")
		else:
			questions = self.application.db.questions.find().sort("_id", pymongo.DESCENDING).limit(10)
			self.render("index.html", questions=questions)

class SignupHandler(BaseHandler):
	def get(self):
		if self.current_user:
			self.redirect("/feed")
		else:
			self.render("signup.html", username_error='', email_error='', password_error='')

	def post(self):
		username = self.get_argument("username")
		email    = self.get_argument("email")
		password = self.get_argument("password")
		users    = self.application.db.users

		if len(username) < 6:
			self.render("signup.html", username_error='Your username must be at least 6 characters long.', email_error='', password_error='')
		elif re.compile("^[a-zA-Z0-9_ ]+$").match(username) == None:
			self.render("signup.html", username_error='Letters, numbers, spaces, and underscores only.', email_error='', password_error='')
		elif re.compile("^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$").match(email) == None:
			self.render("signup.html", username_error='', email_error='Please enter a valid email address.', password_error='')
		elif users.find_one({"email": email}) != None:
			self.render("signup.html", username_error='', email_error='That email is already taken.', password_error='')
		elif len(password) < 6:
			self.render("signup.html", username_error='', email_error='', password_error='Your password must be at least 6 characters long.')
		else:
			salt = bcrypt.gensalt()
			password = bcrypt.hashpw(password.encode('utf-8'), salt)
			user = users.insert_one({"username": username, "email": email, "password": password, "salt": salt, "profile_pic_link": "http://i.imgur.com/pq88IQx.png",
							         "questions": 0, "answers": 0, "following": [], "followers": [], "haters": [], "hating": [], "favorites": [], "shares":[],
							         "bio": "I'm new here!"})
			self.set_secure_cookie("auth_id", email, httponly=True)
			self.redirect("/feed")

class LoginHandler(BaseHandler):
	def get(self):
		if self.current_user:
			self.redirect("/feed")
		else:
			self.render("login.html", email_error='', password_error='')

	def post(self):
		email    = self.get_argument("email")
		password = self.get_argument("password")

		if re.compile("^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$").match(email) == None:
			self.render("login.html", email_error='Please enter a valid email address.', password_error='')
		elif len(password) < 6:
			self.render("login.html", email_error='', password_error='The password you entered is incorrect.')
		else:
			user = self.application.db.users.find_one({"email": email})
			if user == None:
				self.render("login.html", email_error='The email you entered does not match any account.', password_error='')
			elif bcrypt.hashpw(password.encode('utf-8'), user["salt"]) != user["password"]:
				self.render("login.html", email_error='', password_error='The password you entered is incorrect.')
			else:
				self.set_secure_cookie("auth_id", email, httponly=True)
				self.redirect("/feed")

class LogoutHandler(BaseHandler):
	@tornado.web.authenticated
	def post(self):
		self.clear_cookie("auth_id")
		self.redirect("/")

class FollowHandler(BaseHandler):
	@tornado.web.authenticated
	def get(self, target_id):
		target_id   = ObjectId(target_id)
		target_user = self.application.db.users.find_one({"_id": target_id}, {"email": 1, "followers": 1})
		if self.current_user["email"] not in target_user["followers"]:
			self.application.db.users.update_one({"_id": target_id},                    {"$push": {"followers": self.current_user["email"]}})
			self.application.db.users.update_one({"email": self.current_user["email"]}, {"$push": {"following": target_user["email"]}})
			self.write({"followers": len(target_user["followers"]) + 1, "display_text": "Followed"})
		else:
			self.application.db.users.update_one({"_id": target_id},                    {"$pop": {"followers": self.current_user["email"]}})
			self.application.db.users.update_one({"email": self.current_user["email"]}, {"$pop": {"following": target_user["email"]}})
			self.write({"followers": len(target_user["followers"]) - 1, "display_text": "Follow" })

class HateHandler(BaseHandler):
	@tornado.web.authenticated
	def get(self, target_id):
		target_id   = ObjectId(target_id)
		target_user = self.application.db.users.find_one({"_id": target_id}, {"email": 1, "haters": 1})
		if self.current_user["email"] not in target_user["haters"]:
			self.application.db.users.update_one({"_id": target_id},                    {"$push": {"haters": self.current_user["email"]}})
			self.application.db.users.update_one({"email": self.current_user["email"]}, {"$push": {"hating": target_user["email"]}})
			self.write({"haters": len(target_user["haters"]) + 1, "display_text": "Hated"})
		else:
			self.application.db.users.update_one({"_id": target_id},                    {"$pop": {"haters": self.current_user["email"]}})
			self.application.db.users.update_one({"email": self.current_user["email"]}, {"$pop": {"hating": target_user["email"]}})
			self.write({"haters": len(target_user["haters"]) - 1, "display_text": "Hate" })

class EmailHandler(BaseHandler):
	def get(self):
		email = self.get_argument("email")
		if self.application.db.users.find_one({"email": email}) == None:
			self.write({"email_taken": False})
		else:
			self.write({"email_taken": True})

class QuestionHandler(BaseHandler):
	def get(self, question_id):
		question_id = ObjectId(question_id)
		question    = self.application.db.questions.find_one({"_id": question_id})
		asker       = self.application.db.users.find_one({"email": question["asker"]})
		users       = None
		if len(question["comments"]) != 0:
			user_ids = [{"email": comments[0]} for comments in question["comments"]]
			users = list(self.application.db.users.find({"$or": user_ids}, {"username": 1, "email": 1, "profile_pic_link": 1}))
		if question == None:
			pass
		else:
			if self.current_user:
				favorited = question_id in self.current_user["favorites"]
				shared    = question_id in self.current_user["shares"]
			else:
				favorited = shared = False
			self.render("question.html", question=question, asker=asker, users=users, favorited=favorited, shared=shared, datetime=datetime)

class CommentHandler(BaseHandler):
	@tornado.web.authenticated
	def post(self, question_id):
		comment = self.get_argument("comment")
		question = self.application.db.questions.find_one_and_update({"_id": ObjectId(question_id)}, {"$push": {"comments": (self.current_user["email"], datetime.utcnow(), comment)}}, {"_id": 1})
		if question == None:
			self.redirect("/feed")
		else:
			self.redirect("/questions/" + question_id)

class FavoriteHandler(BaseHandler):
	@tornado.web.authenticated
	def get(self, question_id):
		question_id = ObjectId(question_id)
		if ObjectId(question_id) not in self.current_user["favorites"]:
			self.application.db.users.update_one({"email": self.current_user["email"]}, {"$push": {"favorites": question_id}})
			self.application.db.questions.update_one({"_id": question_id}, {"$inc": {"favorites": 1}})
			self.write({"favorite": True})
		else:
			self.application.db.users.update_one({"email": self.current_user["email"]}, {"$pop": {"favorites": question_id}})
			self.application.db.questions.update_one({"_id": question_id}, {"$inc": {"favorites": -1}})
			self.write({"favorite": False})

class ShareHandler(BaseHandler):
	@tornado.web.authenticated
	def get(self, question_id):
		question_id = ObjectId(question_id)
		if ObjectId(question_id) not in self.current_user["shares"]:
			self.application.db.users.update_one({"email": self.current_user["email"]}, {"$push": {"shares": question_id}})
			self.application.db.questions.update_one({"_id": question_id}, {"$inc": {"shares": 1}})
			self.write({"share": True})
		else:
			self.application.db.users.update_one({"email": self.current_user["email"]}, {"$pop": {"shares": question_id}})
			self.application.db.questions.update_one({"_id": question_id}, {"$inc": {"shares": -1}})
			self.write({"share": False})

class CreateQuestionHandler(BaseHandler):
	@tornado.web.authenticated
	def post(self):
		question_title = self.get_argument("question-title")
		image_link     = self.get_argument("image-link")
		answer_1       = self.get_argument("answer-1")
		answer_2       = self.get_argument("answer-2")
		answer_3       = self.get_argument("answer-3")
		answer_4       = self.get_argument("answer-4")
		answer_5       = self.get_argument("answer-5")

		labels = [answer for answer in [answer_1, answer_2, answer_3, answer_4, answer_5] if answer]
		data = [0 for count in range(len(labels))]

		self.application.db.questions.insert_one({"asker":      self.current_user,
												  "question":   question_title,
												  "date":       datetime.now(),
										 		  "image_link": image_link,
										 		  "labels":     labels,
										          "data":       data,})
		self.application.db.users.update_one({"email": self.current_user}, {"$inc": {"questions": 1}})
		self.redirect("/feed")

class ProfileHandler(BaseHandler):
	def get(self, user_id):
		target_user = self.application.db.users.find_one({"_id": ObjectId(user_id)}, {"hating": 0})
		if self.current_user and self.current_user["email"] == target_user["email"]:
			self.redirect("/feed")
		else:
			questions = self.application.db.questions.find().sort("_id", pymongo.DESCENDING).limit(10)
			self.render("newsfeed.html", profile=target_user, current_user=self.current_user, users=self.application.db.users, questions=questions, controlled=False, datetime=datetime)

class FeedHandler(BaseHandler):
	@tornado.web.authenticated
	def get(self):
		questions = self.application.db.questions.find().sort("_id", pymongo.DESCENDING).limit(10)
		self.render("newsfeed.html", profile=self.current_user, current_user=self.current_user, users=self.application.db.users, questions=questions, controlled=True, datetime=datetime)

if __name__ == "__main__":
	tornado.options.parse_command_line()
	http_server = tornado.httpserver.HTTPServer(Application())
	http_server.listen((int(os.environ.get('PORT', 8000))))
	tornado.ioloop.IOLoop.instance().start()
