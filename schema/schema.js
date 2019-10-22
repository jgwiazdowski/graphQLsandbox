const graphql = require('graphql');
const _ = require('lodash');
const axios = require('axios');
const axiosInstance = axios.create({ baseURL: "http://127.0.0.1:3000" });


const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList
} = graphql;



const CompanyType = new GraphQLObjectType({
    name: "Company",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return axiosInstance.get(`/companies/${parentValue.id}/users`)
                    .then(response => response.data)
                    .catch(err => err);
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                return axiosInstance.get(`/companies/${parentValue.companyId}`)
                    .then(response => response.data)
                    .catch(err => err);
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axiosInstance.get(`/users/${args.id}`)
                    .then(response => response.data)
                    .catch(err => err);
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axiosInstance.get(`/companies/${args.id}`)
                    .then(response => response.data)
                    .catch(err => err);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});
