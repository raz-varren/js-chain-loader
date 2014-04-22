js-chain-loader
===============

Generate synchronous and asynchronous AJAX request queues.

### Usage:

##### JSFiddle: [http://jsfiddle.net/W9NfP/1/](http://jsfiddle.net/W9NfP/1/)

```html
<!DOCTYPE html>
<html>
	<head>
		<title>Chain Loader</title>
		<style type="text/css">
			div{
				float: left;
				width: 150px;
			}
		</style>
	</head>
	<body>
		<div>
			<label for="sync">Synchronous</label>
			<ul id="sync">

			</ul>
		</div>

		<div>
		<label for="async">Asynchronous</label>
			<ul id="async">

			</ul>
		</div>
		
		<script type="text/javascript" src="jQuery-2.1.0.js"></script>
		<script type="text/javascript" src="js-chain-loader.js"></script>
		<script type="text/javascript">
			var 
				node = function(str){
					return $('<li />').text(str);
				},
				makeRequest = function(id, callback){
					return { 
						request:{
							url: '/echo/json/', 
							data: {
								json: JSON.stringify({id: id})
							}
						}, 
						callback: callback
					};
				},
				addSyncNode = function(data){ $('#sync').append(node('id: '+data.id)); },
				addAsyncNode = function(data){ $('#async').append(node('id: '+data.id)); };

			for(var i=0; i<10; i++){
				ChainLoader.addSync(makeRequest(i, addSyncNode));
				ChainLoader.addAsync(makeRequest(i, addAsyncNode));    
			}

			ChainLoader.flushSync()
			.then(function(){
				$('#sync').append(node('Sync Done'));
				return ChainLoader.flushAsync();
			})
			.then(function(){
				$('#async').append(node('Async Done'));
			});
		</script>
	</body>
</html>
```