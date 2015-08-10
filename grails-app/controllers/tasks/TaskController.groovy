package tasks

class TaskController {

    def index() { 
	 redirect(action: "tasks3")
	}
	
	def tasks3 = {
	[ task: Category.list() ]
	}
}
