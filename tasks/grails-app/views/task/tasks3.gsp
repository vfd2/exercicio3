<!doctype html>
<html>
<head>
<title>Tarefas</title>
<g:javascript library="jquery" />
</head>
<body>
<div>
<g:select from="${task.category}" name="ling"/>
<p>${task.category}</p>
<g:link action="global">
Admin
</g:link>
</div>
</body>
</html>