#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import wsgiref.handlers

from google.appengine.ext import db
from google.appengine.ext import webapp
from google.appengine.api import users
from google.appengine.api import users
from google.appengine.ext.webapp import template
from domain import Time

class MainHandler(webapp.RequestHandler):

  def get(self):
	user = users.get_current_user()
	
	if user:
		times = Time.gql("where author = :1 order by date desc limit 10", user)
		self.response.out.write(template.render("timer.html", { 'times': times, 'username' : user.nickname(), 
															    'logout' : users.create_logout_url("/") }))
	else:
		self.redirect(users.create_login_url(self.request.uri))

class CreateTime(webapp.RequestHandler):
  def post(self):
	user = users.get_current_user() 
	
	if not user:
		self.response.set_status(401)
		self.out.write("Not authorized")
	
	time = Time(time = self.request.get("time"), author = user)
	time.put()
	
	self.response.out.write("ok")
	
class GetTimes(webapp.RequestHandler):
  def get(self):
	user = users.get_current_user() 

	if not user:
		self.response.set_status(401)
		self.response.out.write("Not authorized")
	
	times = Time.gql("where author = :1 order by date desc limit 1", user)
	
	xml = "<times>"
	
	data_template = "<data time='%.2f' date='%s' key='%s' />"
	
	for time in times:
		xml += data_template % (float(time.time) / 1000, time.date, time.key())
		
	xml += "</times>"
	
	self.response.headers['Content-Type'] = 'application/xml'
	self.response.set_status(200)
	self.response.out.write(xml)
	
class DeleteTime(webapp.RequestHandler):
	def post(self):
		try:
			user = users.get_current_user()

			if not user:
				self.response.set_status(401)
				self.response.out.write("Not authorized")

			time = Time.get(self.request.get("key"))

			time.delete()

			self.response.out.write("Ok.")			
		except Exception, e:
			self.response.out.write(e.message)
	
def main():
  application = webapp.WSGIApplication([('/', MainHandler), ('/post', CreateTime), ('/times', GetTimes), ('/delete', DeleteTime)],
                                       debug=True)
  wsgiref.handlers.CGIHandler().run(application)


if __name__ == '__main__':
  main()
