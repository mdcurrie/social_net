import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import datetime
import pymongo
import logging
import os.path
import bcrypt
import re
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
					(r"/users/(\w+)", ProfileHandler),
					(r"/follow/(\w+)", FollowHandler),
					(r"/hate/(\w+)", HateHandler),
					(r"/username_lookup", UsernameHandler),
					(r"/email_lookup", EmailHandler),
					(r"/questions/(\w+)", QuestionHandler),
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
		questions = self.db.questions
		questions.insert_one({"asker":      "BasedGod",
						 "question":   "Whos gonna become president? no trolls pls",
						 "date":	   datetime.datetime.now(),
				 		 "image_link": "http://i.imgur.com/l4PPTGC.jpg",
				 		 "labels":     ("hillary", "trump", "can obama get another term", "i hate them both"),
				 		 "data":       (63, 13, 300, 120),
				 		 "comments":   [("SomeGuy", "i still believe in bernie tho =["),
				 			  		    ("WFT", "hillary is a liar and should be in jail"),
				 			 		    ("Marcus", "CLINTON2016")]})

		questions.insert_one({"asker":      "BasedGod",
						 "question":   "Rate Beyonces new album!",
						 "date":       datetime.datetime.now(),
						 "image_link": "http://i.imgur.com/SX3tMDg.jpg",
						 "labels":     ("it was LIT", "shes done better", "worse than Miley"),
						 "data":       (12, 19, 3),
						 "comments":   [("The Infraggable Krunk", "the lightd and pyrotechnics tho 0.0"),
						 			    ("Yoshi", "i died and then was reborn"),
						 			    ("Keeper of the Swag", "cant stand her, she is a greasy illuminati puppet and trump supporter.")]})

		users = self.db.users
		users.insert_one({"username":         "BasedGod", 
						  "email":            "based@god.com",
						  "password":         "password",
						  "profile_pic_link": "http://i.imgur.com/MQam61S.jpg",
						  "questions":        2,
						  "answers":          58,
						  "following":        [],
						  "followers":        [],
						  "haters":           [],
						  "hating":			  [],
						  "bio":              "Mogul, First Rapper Ever To Write And Publish A Book at 19, Film Score, Composer, Producer, Director #BASED"})

		tornado.web.Application.__init__(self, handlers, **settings)	

class BaseHandler(tornado.web.RequestHandler):
	def get_current_user(self):
		user_cookie = self.get_secure_cookie("username")
		if user_cookie:
			return str(user_cookie, "utf-8")
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
		elif re.compile("^[a-zA-Z0-9_]+$").match(username) == None:
			self.render("signup.html", username_error='Letters, numbers, and underscores only.', email_error='', password_error='')
		elif users.find_one({"username": username}) != None:
			self.render("signup.html", username_error='That username is already taken.', email_error='', password_error='')
		elif re.compile("^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$").match(email) == None:
			self.render("signup.html", username_error='', email_error='Please enter a valid email address.', password_error='')
		elif users.find_one({"email": email}) != None:
			self.render("signup.html", username_error='', email_error='That email is already taken.', password_error='')
		elif len(password) < 6:
			self.render("signup.html", username_error='', email_error='', password_error='Your password must be at least 6 characters long.')
		else:
			users.insert_one({"username": username, "email": email, "password": password, "profile_pic_link": "http://i.imgur.com/pq88IQx.png",
							  "questions": 0, "answers": 0, "following": [], "followers": [], "haters": [], "hating": [], "bio": "I'm new here!"})
			self.set_secure_cookie("username", username)
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
			elif password != user["password"]:
				self.render("login.html", email_error='', password_error='The password you entered is incorrect.')
			else:
				self.set_secure_cookie("username", user["username"])
				self.redirect("/feed")

class LogoutHandler(BaseHandler):
	def post(self):
		self.clear_cookie("username")
		self.redirect("/")

class FollowHandler(BaseHandler):
	def get(self, user_id):
		user_followers = self.application.db.users.find_one({"_id": ObjectId(user_id)})["followers"]
		if self.current_user not in user_followers:
			self.application.db.users.update_one({"_id": ObjectId(user_id)}, {"$push": {"followers": self.current_user}})
			self.application.db.users.update_one({"username": self.current_user}, {"$push": {"following": self.application.db.users.find_one({"_id": ObjectId(user_id)})["username"]}})
			self.write({"followers": len(self.application.db.users.find_one({"_id": ObjectId(user_id)})["followers"]), "display_text": "Followed" })
		else:
			self.application.db.users.update_one({"_id": ObjectId(user_id)}, {"$pop": {"followers": self.current_user}})
			self.application.db.users.update_one({"username": self.current_user}, {"$pop": {"following": self.application.db.users.find_one({"_id": ObjectId(user_id)})["username"]}})
			self.write({"followers": len(self.application.db.users.find_one({"_id": ObjectId(user_id)})["followers"]), "display_text": "Follow" })

class HateHandler(BaseHandler):
	def get(self, user_id):
		user_haters = self.application.db.users.find_one({"_id": ObjectId(user_id)})["haters"]
		if self.current_user not in user_haters:
			self.application.db.users.update_one({"_id": ObjectId(user_id)}, {"$push": {"haters": self.current_user}})
			self.application.db.users.update_one({"username": self.current_user}, {"$push": {"hating": self.application.db.users.find_one({"_id": ObjectId(user_id)})["username"]}})
			self.write({"haters": len(self.application.db.users.find_one({"_id": ObjectId(user_id)})["haters"]), "display_text": "Hated" })
		else:
			self.application.db.users.update_one({"_id": ObjectId(user_id)}, {"$pop": {"haters": self.current_user}})
			self.application.db.users.update_one({"username": self.current_user}, {"$pop": {"hating": self.application.db.users.find_one({"_id": ObjectId(user_id)})["username"]}})
			self.write({"haters": len(self.application.db.users.find_one({"_id": ObjectId(user_id)})["haters"]), "display_text": "Hate" })

class UsernameHandler(BaseHandler):
	def get(self):
		username = self.get_argument("username")
		if self.application.db.users.find_one({"username": username}) == None:
			self.write({"username_taken": False})
		else:
			self.write({"username_taken": True})

class EmailHandler(BaseHandler):
	def get(self):
		email = self.get_argument("email")
		if self.application.db.users.find_one({"email": email}) == None:
			self.write({"email_taken": False})
		else:
			self.write({"email_taken": True})

class QuestionHandler(BaseHandler):
	def get(self, question_id):
		question = self.application.db.questions.find_one({"_id": ObjectId(question_id)})
		asker    = self.application.db.users.find_one({"username": question["asker"]})
		if question == None:
			self.set_status(404)
		else:
			self.render("question.html", question=question, asker=asker)

class CreateQuestionHandler(BaseHandler):
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
											  "date":       datetime.datetime.now(),
									 		  "image_link": image_link,
									 		  "labels":     labels,
									          "data":       data,})
		self.application.db.users.update_one({"username": self.current_user}, {"$inc": {"questions": 1}})
		self.redirect("/feed")

class ProfileHandler(BaseHandler):
	def get(self, user_id):
		user = self.application.db.users.find_one({"_id": ObjectId(user_id)})
		if self.current_user == user["username"]:
			self.redirect("/feed")
		else:
			questions = self.application.db.questions.find().sort("_id", pymongo.DESCENDING).limit(10)
			self.render("newsfeed.html", profile=user, current_user=self.current_user, users=self.application.db.users, questions=questions, controlled=False)

class FeedHandler(BaseHandler):
	@tornado.web.authenticated
	def get(self):
		current_user = self.application.db.users.find_one({"username": self.current_user})
		if current_user == None:
			self.clear_cookie("username")
			self.redirect("/")
		else:
			questions = self.application.db.questions.find().sort("_id", pymongo.DESCENDING).limit(10)
			self.render("newsfeed.html", profile=current_user, currnet_user=self.current_user, users=self.application.db.users, questions=questions, controlled=True)

if __name__ == "__main__":
	tornado.options.parse_command_line()
	http_server = tornado.httpserver.HTTPServer(Application())
	http_server.listen(options.port)
	tornado.ioloop.IOLoop.instance().start()
