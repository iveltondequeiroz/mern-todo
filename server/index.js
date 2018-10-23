const { GraphQLServer } = require('graphql-yoga')
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/testtodo');

var todoSchema = new mongoose.Schema({
  text: String,
  complete: Boolean
});

var Todo = mongoose.model('Todo', todoSchema );

const typeDefs = `
  type Query {
    hello(name: String): String!
  }
  type Todo {
  	id: ID!
  	text: String!
  	complete: Boolean!
  }
  type Mutation {
  	createTodo(text:String!): Todo
  }
`
const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
  },
  Mutation: {
  	createTodo: async  (_, { text }) => {
  		const todo = new Todo({text, complete: false });
  		await todo.save();
  		return todo;
  	}
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
mongoose.connection.once('open', function() {
	server.start(() => console.log('Server is running on localhost:4000'));
});


