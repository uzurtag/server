const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLID, GraphQLBoolean } = graphql;

const Todo = require('../models/todo');
const Board = require('../models/board');
const googleApi = require('../integration/google_calendar');

const TodoType = new GraphQLObjectType({
    'name': 'Todo',
    'fields': () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        date: { type: GraphQLString },
        sync: { type: GraphQLBoolean },
    }),
});

const TodosType = new GraphQLObjectType({
    'name': 'Todos',
    'fields': () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        date: { type: GraphQLString },
        sync: { type: GraphQLBoolean },
    }),
});

const BoardType = new GraphQLObjectType({
    'name': 'Board',
    'fields': () => ({
        id: { type: GraphQLID },
        key: { type: GraphQLString },
        value: { type: GraphQLString },
    }),
});

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        todos: {
            type: new GraphQLList(TodosType),
            resolve(parent, args) {
                return Todo.find({});
            },
        },
        todo: {
            type: TodoType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Todo.findById(args.id);
            },
        },
        status: {
            type: new GraphQLList(BoardType),
            resolve(parent, args) {
                return Board.find({});
            },
        },
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addTodo: {
            type: TodoType,
            args: {
                title: { type: GraphQLString },
                description: { type: GraphQLString },
                status: { type: GraphQLString },
                date: { type: GraphQLString },
                sync: { type: GraphQLBoolean },
            },
            resolve(parent, args) {
                const todo = new Todo({
                    title: args.title,
                    description: args.description,
                    status: args.status,
                    date: args.date,
                    sync: args.sync,
                });
                return todo.save();
            }
        },
        updateTodo: {
            type: TodoType,
            args: {
                id: { type: GraphQLID },
                title: { type: GraphQLString },
                description: { type: GraphQLString },
                date: { type: GraphQLString },
            },
            resolve(parent, args) {
                return Todo.findByIdAndUpdate(
                    args.id,
                    { $set: { title: args.title, description: args.description, date: args.date } },
                    { new: true },
                );
            }
        },
        updateTodoStatus: {
            type: TodoType,
            args: {
                id: { type: GraphQLID },
                status: { type: GraphQLString },
            },
            resolve(parent, args) {
                return Todo.findByIdAndUpdate(
                    args.id,
                    { $set: { status: args.status } },
                    { new: true }
                );
            }
        },
        sync: {
            type: TodoType,
            args: {
                id: { type: GraphQLID },
                sync: { type: GraphQLBoolean },
            },
            resolve(parent, args, context) {
                Todo.findById(args.id).exec((err, todo) => {
                    if (!todo) {
                        return res.status(404).json({ "message": "todo not found" });
                    } else if (err) {
                        return res.status(404).json(err);
                    }
                    googleApi.insertEvent(todo);
                });
                return Todo.findByIdAndUpdate(
                    args.id,
                    { $set: { sync: args.sync } },
                    { new: true }
                );
            }
        },
        deleteTodo: {
            type: TodoType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Todo.findByIdAndRemove(args.id);
            }
        },
        addBoard: {
            type: BoardType,
            args: {
                key: { type: GraphQLString },
                value: { type: GraphQLString },
            },
            resolve(parent, args) {
                const status = new Board({
                    key: args.key,
                    value: args.value,
                });
                return status.save();
            }
        },
        deleteBoard: {
            type: BoardType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Board.findByIdAndRemove(args.id);
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
});