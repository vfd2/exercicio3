<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Tarefas<g:layoutTitle/></title>
<link rel="stylesheet" href="<g:createLinkTo dir='css/styles' file='02-tasks.css'/>"/>
<g:layoutHead />
<g:javascript library="jquery" />
<script src= "<g:createLinkTo dir='js/scripts' file='jquery-2.1.4.js'/>" type="text/javascript"></script>
<script src= "<g:createLinkTo dir='js/scripts' file='jquery-tmpl.js'/>" type="text/javascript"></script>
<script src= "<g:createLinkTo dir='js/scripts' file='jquery-serialization.js'/>" type="text/javascript"></script>
<script src= "<g:createLinkTo dir='js/scripts' file='tasks-controller.js'/>" type="text/javascript"></script>
<script src= "<g:createLinkTo dir='js/scripts' file='jquery.validate.js'/>" type="text/javascript"></script>
<script src= "<g:createLinkTo dir='js/scripts' file='tasks-webstorage.js'/>" type="text/javascript"></script>
<script src= "<g:createLinkTo dir='js/scripts' file='date.js'/>" type="text/javascript"></script>
<g:layoutHead />
</head>
<body>
	<header>
		<span>Lista de Tarefas</span>
	</header>
	<main id="taskPage">
		<section id="taskCreation" class="not">
			<form id="taskForm">
			    <input type="hidden" name="id" />
				<div>
					<label>Tarefa</label> 
					<input type="text" required="required" name="task1" class="large" placeholder="Estudar e programar" maxlength="200"/>
				</div>
				<div>
					<label>Finalizar até</label> <input type="date" required="required" name="requiredBy" />
				</div>
				<div>
					<label><a href="https://vivian-exercicio3.herokuapp.com/category/index">Categoria</a></label> 
					<g:select from="${task.category}" name="category1"/>
					
				</div>
				<nav>
				    <a href="#" id="saveTask">Salvar tarefa</a> <a href="#" id="clearTask">Limpar tarefa</a>
				</nav>
			</form>
		</section>
		<section>
			<table id="tblTasks">
				<colgroup>
					<col width="40%">
					<col width="15%">
					<col width="15%">
					<col width="30%">
				</colgroup>
				<thead>
					<tr>
						<th>Nome</th>
						<th>Deadline</th>
						<th>Categoria</th>
						<th>Ações</th>
					</tr>
				</thead>
				<tbody>
					
				</tbody>
			</table>
			<nav>
				<a href="#" id="btnAddTask">Adicionar tarefa</a>
			</nav>
		</section>
	</main> 
	<footer>Você tem <span id="taskCount"></span> tarefas</footer>
</body>
<script>
function initScreen() {
  $(document).ready(function() {
    tasksController.init($('#taskPage'), function() {
      tasksController.loadTasks();
    });
  });
  
}
//Verifica se o browser suporta o indexedDB
if (window.indexedDB) { 
	$.getScript( "<g:createLinkTo dir='js/scripts' file='tasks-indexeddb.js'/>" )
	.done(function( script, textStatus ) {
		initScreen();
	})
	.fail(function( jqxhr, settings, exception ) {
		console.log( 'Falhou ao carregar script de indexed db' );
	});
} else if (window.localStorage) {
	$.getScript( "<g:createLinkTo dir='js/scripts' file='tasks-webstorage.js'/>" )
	.done(function( script, textStatus ) {
		initScreen();
	})
	.fail(function( jqxhr, settings, exception ) {
		console.log( 'Falhou ao carregar script de web storage' );
	});
}


</script>
<script id="taskRow" type="text/x-jQuery-tmpl">
					<tr>
					<!-- Adiciona a classe taskCompleted para riscar os valores das tarefas completadas-->
					<!-- quando o complet3 recebe o valor true. -->
						<td {{if complet3 == true}} class="taskCompleted" {{/if}}> ${task1}</td>
						<td {{if complet3 == true}} class="taskCompleted" {{/if}}><time datetime="${requiredBy}"> ${requiredBy}</time></td>
						<td {{if complet3 == true}} class="taskCompleted" {{/if}}>${category1}</td>
						<td>
							<nav>
							{{if complet3 != true}}
								<a href="#" class="editRow" data-task-id="${id}">Editar</a>
								<a href="#" class="completeRow" data-task-id="${id}">Completar</a>
							{{/if}}	
								<a href="#" class="deleteRow" data-task-id="${id}">Deletar</a>
							</nav>
						</td>
					</tr>
</script>
</html>
