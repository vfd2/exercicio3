<%@ page import="tasks.Category" %>



<div class="fieldcontain ${hasErrors(bean: categoryInstance, field: 'category', 'error')} required">
	<label for="category">
		<g:message code="category.category.label" default="Category" />
		<span class="required-indicator">*</span>
	</label>
	<g:textField name="category" required="" value="${categoryInstance?.category}"/>

</div>

