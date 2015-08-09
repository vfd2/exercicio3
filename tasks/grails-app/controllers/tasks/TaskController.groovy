package tasks

class TaskController {

    def index() { 
	 redirect(action: "tasks3")
	}
	
	def home() {
	render "<h1>Tarefas</h1>"
	}
	
	def tasks3 = {
	
	[ task: Category.list() ]
	}
}
