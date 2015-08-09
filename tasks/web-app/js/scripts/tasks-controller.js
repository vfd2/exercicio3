tasksController = function() {
	function errorLogger(errorCode, errorMessage) {
	console.log(errorCode +':'+ errorMessage);
	}
	
	//Item 1 - Atualiza a contagem de tarefas.
	function taskQuant() {
	// Aqui está recebendo somente a quantidade de tarefas completadas. Os dados da tarefa na linha estão separados 
	// em três colunas, por isso estou dividindo por 3 para obter um valor único.
	
		var quantCompleted = $("#tblTasks tbody tr").find(".taskCompleted").length/3;
		
		// Aqui recebe a quantidade total de tarefas.
		var quanttasks = $("#tblTasks tbody tr").length;
		
		//Se a quantidade de tarefas for maior que zero significa que existe tarefa.
		if(quanttasks > 0)
		{
				//Para obter a quantidade de tarefa pendentes, fiz a subtração do total de tarefas menos o total 
				//de tarefas completadas.
				var total = quanttasks - quantCompleted;
				//Insere a quantidade de tarefas pendentes
				$('footer').html("Você tem " + total + " tarefa(s)");
		}
		else
		{
			    //Insere a frase caso não exista nenhuma tarefa
				$('footer').html("Você não tem tarefa");
		}
		
	}
	
	// Item 3 - destaca tarefas que já passaram do deadline
	function date() {
		//Percorre todas as linhas da tabela e procura pelo datetime e atribui a datetask a data da tarefa.
		$.each($(taskPage).find('#tblTasks tbody tr'), function(id, line) {
		var datetask = Date.parse($(line).find('[datetime]').text());
		//Compara se a data da tarefa é menor que a data de hoje.
		//Se for menor adiciona a classe overdue as linhas das tarefas que tem as datas vencidas.
		if(datetask.compareTo(Date.today()) < 0) {
			$(line).addClass("overdue");
		} 
		//Senão adiciona a classe warning as linhas das tarefas que tem a data com prazo de validade próximo 
		//de 0 a 5 dias comparando com a data de hoje.
		else if (datetask.compareTo((5).days().fromNow()) <= 0) {
			$(line).addClass("warning");
		}});
	}
	
	// 5 - Exibe as tarefas ordenadas
	//O sort está ordenando as tarefas pelas datas
	function order(tasks){
		tasks.sort(function(dt1, dt2) {
			return Date.parse(dt1.requiredBy).compareTo(Date.parse(dt2.requiredBy));
		});	
	}
	
	var taskPage;
	var initialised = false;   
	return {
		init : function(page, callback) {
					
			if (!initialised) {
				
				storageEngine.init(function() {
						storageEngine.initObjectStore('task1', function() {
							callback();
						}, errorLogger) 
				}, errorLogger);
				
				taskPage = page;
				$(taskPage).find( '[required="required"]' ).prev('label').append( '<span>*</span>').children( 'span').addClass('required');
				$(taskPage).find('tbody tr:even').addClass( 'even');
								
				$(taskPage).find( '#btnAddTask' ).click( function(evt) {
					evt.preventDefault();
					$(taskPage ).find('#taskCreation' ).removeClass('not');
				});
				$(taskPage).find('tbody tr' ).click(function(evt) {
					$(evt.target ).closest('td').siblings( ).andSelf( ).toggleClass('rowHighlight');
				});
				$(taskPage).find('#tblTasks tbody').on('click', '.deleteRow', 
					function(evt) { 					
						console.log('teste');
						storageEngine.delete('task1', $(evt.target).data().taskId, 
					function() {
						$(evt.target).parents('tr').remove(); 
						taskQuant();
					}, errorLogger);
				});	
				$(taskPage).find('#saveTask').click(function(evt) {
					evt.preventDefault();
					if ($(taskPage).find('form').valid()) {
						var task1 = $(taskPage).find('form').toObject();		
						storageEngine.save('task1', task1, function() {
						$(taskPage).find('#tblTasks tbody').empty();
						tasksController.loadTasks();
						$(':input').val('');
						$(taskPage).find('#taskCreation').addClass('not');
					}, errorLogger);
					}
				});
							
				// 2 - Ativa o botão de limpar tarefa
				// Ao clicar no botão com id=clearTask é resetado os campos do form com id=taskForm.
				$(taskPage).find('#clearTask').on('click',
				function() {
					$("#taskForm")[0].reset();
				});
				
				// 4 - Marcar tarefa como completada
				//Pega a tarefa que foi clicado no botão class=completeRow
				$(taskPage).find('#tblTasks tbody').on('click', '.completeRow', 
					function(evt) { 
						storageEngine.findById('task1', $(evt.target).data().taskId, function(task1) {
						//A tarefa que foi completada recebe o valor true.
						task1.complet3 = true;
						//salva a tarefa e recarrega as alterações.
						storageEngine.save('task1', task1, function() {
							tasksController.loadTasks();
							
						},errorLogger);
					},errorLogger);
				});
								
				$(taskPage).find('#tblTasks tbody').on('click', '.editRow', 
					function(evt) { 
						$(taskPage).find('#taskCreation').removeClass('not');
						storageEngine.findById('task1', $(evt.target).data().taskId, function(task1) {
						$(taskPage).find('form').fromObject(task1);
					}, errorLogger);
				});
				initialised = true;
			}
    	},
		loadTasks : function() {
		$(taskPage).find('#tblTasks tbody').empty();
		storageEngine.findAll('task1', 
		function(tasks) {
			order(tasks);
			$.each(tasks, function(index, task1) {
				if (!task1.complet3) {
					// Seta o complet3 para false para não adicionar a classe taskCompleted a dt dos botões editar e completar.
					task1.complet3 = false;
				}
				$('#taskRow').tmpl(task1 ).appendTo( $(taskPage ).find( '#tblTasks tbody'));
				taskQuant();
				date();
			});
		}, 
		errorLogger);
		}
	}
}();