storageEngine = function() {
  var database;
  // item 6 - usando indexedDB
  return {
    init : function(successCallback, errorCallback) {
      if (window.indexedDB) {
		//Cria um pedido para abrir o banco de dados com o nome dbtask  
        var request = indexedDB.open(window.location.hostname+'dbtask');
        request.onsuccess = function(event) {
          database = request.result;
          successCallback(null);
        }
        request.onerror = function(event) {
          errorCallback('Nao foi possivel inicializar.');
        }
      } else {
        errorCallback('Nao suportado');
      }     
    },
    initObjectStore  : function(type, successCallback, errorCallback) {
        if (!database) {
        errorCallback('Nao foi possivel inicializar.');
      }
        var exists = false;
        $.each(database.objectStoreNames, function(i, v) {
            if (v == type) {
              exists = true;
            }
        });
        if (exists) {
          successCallback(null);
        } else {
          var version = database.version+1;
          database.close();
		  //Abre o banco de dados
          var request = indexedDB.open(window.location.hostname+'dbtask', version);
        request.onsuccess = function(event) {
          successCallback(null);
        }
        request.onerror = function(event) {
          errorCallback('Nao foi possivel inicializar.');
        }
        request.onupgradeneeded = function(event) {
          database = event.target.result;
		    //Cria o objectstore para o banco
            var objectStore = database.createObjectStore(type, { keyPath: "id", autoIncrement: true });
          
        }
        }
      },
      save : function(type, obj, successCallback, errorCallback) { 
        if (!database) {
          errorCallback('Nao foi possivel inicializar.');
        }
        if (!obj.id) {
          delete obj.id ;
        } else {
          obj.id = parseInt(obj.id)
        }
		//Cria uma transação com permissão de leitura e escrita
        var tx = database.transaction([type], "readwrite");
        tx.oncomplete = function(event) {
          successCallback(obj);
        };
        tx.onerror = function(event) {
          errorCallback('Erro na transacao');
        };
        var objectStore = tx.objectStore(type);
		//Salva o objeto no banco
        var request = objectStore.put(obj);
        request.onsuccess = function(event) {
          obj.id = event.target.result
        }
		//Trata os erros
        request.onerror = function(event) {
          errorCallback('Erro, nao armazenou objeto');
        };
      },
      findAll : function(type, successCallback, errorCallback) { 
        if (!database) {
          errorCallback('Nao foi inicializado.');
        }
        var result = [];
        var tx = database.transaction(type);
        var objectStore = tx.objectStore(type);
        objectStore.openCursor().onsuccess = function(event) {
          var cursor = event.target.result;
          if (cursor) {
            result.push(cursor.value);
            cursor.continue();
          } else {
            successCallback(result);
          }
        };        
      },
      delete : function(type, id, successCallback, errorCallback) { 
        var obj = {};
		//Recebe a chave do objeto que vai ser excluído.
        obj.id = id;
		//Cria uma transação com permissão de leitura e escrita
        var tx = database.transaction([type], "readwrite");
        tx.oncomplete = function(event) {
          successCallback(id);
        };
        tx.onerror = function(event) {
          console.log(event);
          errorCallback('Erro na transacao');
        };
        var objectStore = tx.objectStore(type); 
        //Deleta o objeto		
        var request = objectStore.delete(id);
        request.onsuccess = function(event) {       
        }
		//Trata o erro
        request.onerror = function(event) {
          errorCallback('Nao foi possivel deletar o objeto.');
        };
      },
      findByProperty : function(type, propertyName, propertyValue, successCallback, errorCallback) {
        if (!database) {
          errorCallback('Nao foi possivel inicializar.');
        }
        var result = [];
        var tx = database.transaction(type);
        var objectStore = tx.objectStore(type);
        objectStore.openCursor().onsuccess = function(event) {
          var cursor = event.target.result;
          if (cursor) {
            if (cursor.value[propertyName] == propertyValue) {
              result.push(cursor.value);
            }
            cursor.continue();
          } else {
            successCallback(result);
          }
        };
      },
    findById : function (type, id, successCallback, errorCallback)  {
      if (!database) {
        errorCallback('Nao foi possivel inicializar.');
      }
      var tx = database.transaction([type]);
      var objectStore = tx.objectStore(type);
	  //Acessa o objeto pela sua chave.
      var request = objectStore.get(id);
        request.onsuccess = function(event) {
        successCallback(event.target.result);
      }
      request.onerror = function(event) {
        errorCallback('Nao foi possivel localizar o objeto.');
      };        
    }
  }
}();
