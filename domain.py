from google.appengine.ext import db

class Time(db.Model):
	time   = db.StringProperty(required=True)
	author = db.UserProperty();
	date   = db.DateTimeProperty(auto_now_add=True)
	
	def __str__(self):
		t = float(self.time)
		return "%s: %.2fs" % (self.author, (t / 1000))