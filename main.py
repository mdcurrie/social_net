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
			login_url="/",
			ui_modules={"Question": QuestionModule, "Comment": CommentModule},
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
								  "votes":			  [],
								  "bio":              "Mogul, First Rapper Ever To Write And Publish A Book at 19, Film Score, Composer, Producer, Director #BASED"})

		questions = self.db.questions
		questions.insert_one({"asker":      "based@god.com",
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
					 		  				],
					 		  "favorites":  1934,
					 		  "shares":     92903,
					 		  "comments":	[]})

		questions.insert_one({"asker":      "based@god.com",
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
					 		  				],
							  "favorites":  13203156,
							  "shares":     191931,
					 		  "comments":   [("based@god.com", datetime(2015, 4, 12, 0, 0, 0, 0), "not really feeling it"),
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
			self.render("index.html", questions=questions, users=self.application.db.users)

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
							         "questions": 0, "answers": 0, "following": [], "followers": [], "haters": [], "hating": [], "favorites": [], "shares":[], "votes":[],
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
			user = self.application.db.users.find_one({"email": email}, {"salt": 1, "password": 1})
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

class GetFollowersHandler(BaseHandler):
	def get(self, target_id):
		target_id = ObjectId(target_id)
		target_user = self.application.db.users.find_one({"_id": target_id}, {"_id": 0, "followers": 1})
		followers = self.application.db.users.find({"email": {"$in": target_user["followers"]}}, {"_id": 0, "username": 1, "profile_pic_link": 1})
		self.write(json.dumps(list(followers)))

class GetFollowingHandler(BaseHandler):
	def get(self, target_id):
		target_id = ObjectId(target_id)
		target_user = self.application.db.users.find_one({"_id": target_id}, {"_id": 0, "following": 1})
		following = self.application.db.users.find({"email": {"$in": target_user["following"]}}, {"_id": 0, "username": 1, "profile_pic_link": 1})
		self.write(json.dumps(list(following)))

class GetHatersHandler(BaseHandler):
	def get(self, target_id):
		target_id = ObjectId(target_id)
		target_user = self.application.db.users.find_one({"_id": target_id}, {"_id": 0, "haters": 1})
		haters = self.application.db.users.find({"email": {"$in": target_user["haters"]}}, {"_id": 0, "username": 1, "profile_pic_link": 1})
		self.write(json.dumps(list(haters)))

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
				commented = self.current_user["email"] in [comment[0] for comment in question["comments"]]
			else:
				favorited = shared = commented = False
			self.render("question.html", question=question, asker=asker, users=users, favorited=favorited, shared=shared, commented=commented)

class QuestionModule(tornado.web.UIModule):
	def render(self, question, asker, users, favorited, shared, commented, show_comments=False):
		vote = None
		if self.current_user:
			if len(self.current_user["votes"]):
				question_id = ObjectId(question["_id"])
				for idx, x in enumerate(self.current_user["votes"]):
					if question_id in self.current_user["votes"][idx].values():
						vote = self.current_user["votes"][idx]['vote']
						break

		return self.render_string("question_module.html", question=question, asker=asker, users=users, favorited=favorited, shared=shared,
													      commented=commented, show_comments=show_comments, datetime=datetime, json=json, vote=vote)

	def css_files(self):
		return self.handler.static_url("css/question_module.css")

	def javascript_files(self):
		return [self.handler.static_url("js/Chart.js"),
				self.handler.static_url("js/chartmaker.js"),
				self.handler.static_url("js/question_module.js")]

class CommentHandler(BaseHandler):
	@tornado.web.authenticated
	def get(self, question_id):
		comment = self.get_argument("comment")
		question = self.application.db.questions.find_one_and_update({"_id": ObjectId(question_id)}, {"$push": {"comments": (self.current_user["email"], datetime.utcnow(), comment)}}, 
					{"comments": 1}, return_document=pymongo.ReturnDocument.AFTER)
		if question == None:
			self.redirect("/feed")
		else:
			users = None
			if len(question["comments"]) != 0:
				user_ids = [{"email": comments[0]} for comments in question["comments"]]
				users = list(self.application.db.users.find({"$or": user_ids}, {"username": 1, "email": 1, "profile_pic_link": 1}))
			self.render("comment_module.html", question=question, users=users, datetime=datetime)

class CommentModule(tornado.web.UIModule):
	def render(self, question, users):
		return self.render_string("comment_module.html", question=question, users=users, datetime=datetime)

	def css_files(self):
		return self.handler.static_url("css/comment_module.css")

	def javascript_files(self):
		return self.handler.static_url("js/comment_module.js")

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

class VoteHandler(BaseHandler):
	@tornado.web.authenticated
	def get(self, question_id):
		question_id = ObjectId(question_id)
		vote_index  = self.get_argument("vote_index")

		if self.application.db.users.find_one({"email": self.current_user["email"], "votes.question_id": question_id}) == None:
			self.application.db.users.update_one({"email": self.current_user["email"]}, {"$push": {"votes": {"question_id": question_id, "vote": vote_index}}})
			question = self.application.db.questions.find_one_and_update({"_id": question_id}, {"$inc": {"data."+str(vote_index)+".votes": 1}}, return_document=pymongo.ReturnDocument.AFTER)
		else:
			for idx, vote in enumerate(self.current_user["votes"]):
				if vote["question_id"] == question_id:
					self.current_user["votes"][idx]["vote"] = vote_index
					old_vote = self.application.db.users.find_one_and_replace({"email": self.current_user["email"]}, self.current_user)["votes"][idx]["vote"]
					self.application.db.questions.update_one({"_id": question_id}, {"$inc": {"data."+str(old_vote)+".votes": -1}})
					question = self.application.db.questions.find_one_and_update({"_id": question_id}, {"$inc": {"data."+str(vote_index)+".votes": 1}}, return_document=pymongo.ReturnDocument.AFTER)

		question = question["data"]
		self.write({"idx": vote_index, "votes": sum([q["votes"] for q in question])})

class CreateQuestionHandler(BaseHandler):
	@tornado.web.authenticated
	def post(self):
		question_title = self.get_argument("question-title")
		if question_title == '':
			return

		image_link     = self.get_argument("image-link")
		answer_1       = self.get_argument("answer-1")
		answer_2       = self.get_argument("answer-2")
		answer_3       = self.get_argument("answer-3")
		answer_4       = self.get_argument("answer-4")
		answer_5       = self.get_argument("answer-5")

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

		self.application.db.questions.insert_one({"asker":      self.current_user["email"],
												  "question":   question_title,
												  "date":       datetime.now(),
										 		  "image_link": image_link,
										          "data":       data,
										          "favorites":	0,
										          "shares":		0,
										          "comments":	[],
										        })

		self.application.db.users.update_one({"email": self.current_user["email"]}, {"$inc": {"questions": 1}})
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
