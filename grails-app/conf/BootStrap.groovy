import grails.plugin.heroku.PostgresqlServiceInfo
class BootStrap {

    def init = { servletContext ->
	String DATABASE_URL = System.getenv('DATABASE_URL')
	  if (DATABASE_URL){
		try {
			PostgresqlServiceInfo info = new PostgresqlServiceInfo()
			println "\nPostgreSQL service ($DATABASE_URL): url='$info.url', " +
					"user='$info.username', password='$info.password'\n"
		}
		catch (e){
			println "Error occurred parsing DATABASE_URL: $e.message"
		}
	  }
    }
    def destroy = {
    }
}
