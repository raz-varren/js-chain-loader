(function($){
	window.ChainLoader = window.ChainLoader || function(){
		'use strict';
		
		var
		
			debug = false,
			
			syncList = [],
			
			asyncList = [],
			
			ajaxDump = function(data){
				log(data);
			},
			
			ajaxError = function(){
				log('ajax request failed:', arguments[0], arguments[1], arguments[2]);
			},
			
			log = function(){
				if(debug) console.log.apply(console, arguments);
			},
			
			ajaxDefaults = {
				url: '',
				dataType: 'json',
				type: 'post',
				data: {},
				error: ajaxError
			},
			
			ajax = function(options) {
				var options = options || {};
				
				for(var key in ajaxDefaults){
					if(ajaxDefaults.hasOwnProperty(key)){
						options[key] = options[key] || ajaxDefaults[key];
					}
				}
				
				return $.ajax(options);
			},
			
			addSync = function(task){
				syncList.push(task);
			},
			
			addAsync = function(task){
				asyncList.push(task);
			},
			
			flushSync = function(){
				var list = syncList;
				syncList = [];
				
				if(list.length === 0) return $.Deferred().resolve();
				
				return synchronous(list);
			},
			
			flushAsync = function(){
				var list = asyncList;
				asyncList = [];
				
				if(list.length === 0) return $.Deferred().resolve();
				
				return asynchronous(list);
			},
			
			flush = function(){
				
				return flushSync()
				.then(function(){
					return flushAsync();
				});
			},
			
			synchronous = function(taskList, taskIdx){
				taskIdx = taskIdx || 0;
				var task = taskList[taskIdx];
				
				if(!task) return;
				return ajax(task.request)
					.then(task.callback)
					.then(function(){
						return synchronous(taskList, taskIdx + 1);
					});
			},
			
			asynchronous = function(taskList){
				var 
					def = $.Deferred(),
					tasksDone = 0, 
					taskCount = taskList.length, 
					task;
				
				for(var i = 0; i<taskCount; i++){
					task = taskList[i];
					
					ajax(task.request).then(task.callback).then(function(){
						tasksDone++;
						if(tasksDone >= taskCount){
							def.resolve();
						}
					});
				}
				
				return def;
			};
		
		//debug will become a different variable if this
		//code is compiled, which will silence any logs
		if(String(log).search('debug') > 0){ debug = true; }
		log('ChainLoader loaded!');
		
		return {
			sync: synchronous,
			async: asynchronous,
			addSync: addSync,
			addAsync: addAsync,
			flushSync: flushSync,
			flushAsync: flushAsync,
			flush: flush,
			ajax: ajax,
			log: log
		};
	}();
	
})(jQuery);