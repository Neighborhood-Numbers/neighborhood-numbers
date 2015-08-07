var React = require('react');

var App = React.createClass({
	render: function () {
		return <form>
			<input type = 'text'>
		</form>	
	}
});

React.render(<App />, document.body);	
