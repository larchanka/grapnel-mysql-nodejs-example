import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLFloat
} from 'graphql';

import Db from './db';

const Country = new GraphQLObjectType({
  name: 'Country',
  description: 'The list of countries',
  fields () {
    return {
      id: {
        type: GraphQLInt,
        resolve (country) {
          return country.id;
        }
      },
      countryName: {
        type: GraphQLString,
        resolve (country) {
          return country.countryName;
        }
      },
      countryCode: {
        type: GraphQLString,
        resolve (country) {
          return country.countryCode;
        }
      },
      city: {
        type: new GraphQLList(City),
        resolve (country) {
          return country.getCities();
        }
      }
    };
  }
});

const City = new GraphQLObjectType({
  name: 'City',
  description: 'The list of cities',
  fields () {
    return {
      id: {
        type: GraphQLInt,
        resolve (city) {
          return city.id;
        }
      },
      cityName: {
        type: GraphQLString,
        resolve (city) {
          return city.cityName;
        }
      },
      cityLat: {
        type: GraphQLFloat,
        resolve (city) {
          return city.cityLat;
        }
      },
      cityLon: {
        type: GraphQLFloat,
        resolve (city) {
          return city.cityLon;
        }
      },
      country: {
        type: Country,
        resolve (city) {
          return city.getCountry();
        }
      },
      monuments: {
        type: new GraphQLList(Monument),
        resolve (city) {
          return city.getMonuments();
        }
      },
      pubs: {
        type: new GraphQLList(Pub),
        resolve (city) {
          return city.getPubs();
        }
      }
    };
  }
});

const Pub = new GraphQLObjectType({
  name: 'Pub',
  description: 'The list of pubs',
  fields () {
    return {
      id: {
        type: GraphQLInt,
        resolve (pub) {
          return pub.id;
        }
      },
      pubName: {
        type: GraphQLString,
        resolve (pub) {
          return pub.pubName;
        }
      },
      pubRating: {
        type: GraphQLInt,
        resolve (pub) {
          return pub.pubRating;
        }
      },
      city: {
        type: City,
        resolve (pub) {
          return pub.getCity();
        }
      }
    };
  }
});

const Monument = new GraphQLObjectType({
  name: 'Monument',
  description: 'The list of monuments',
  fields () {
    return {
      id: {
        type: GraphQLInt,
        resolve (monument) {
          return monument.id;
        }
      },
      monumentName: {
        type: GraphQLString,
        resolve (monument) {
          return monument.monumentName;
        }
      },
      city: {
        type: City,
        resolve (monument) {
          return monument.getCity();
        }
      }
    };
  }
});

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Query object',
  fields: () => {
    return {
      countries: {
        type: new GraphQLList(Country),
        args: {
          id: {
            type: GraphQLInt
          },
          countryName: {
            type: GraphQLString
          },
          countryCode: {
            type: GraphQLString
          }
        },
        resolve (root, args) {
          return Db.models.country.findAll({ where: args });
        }
      },
      cities: {
        type: new GraphQLList(City),
        resolve (root, args) {
          return Db.models.city.findAll({ where: args });
        }
      },
      pubs: {
        type: new GraphQLList(Pub),
        resolve (root, args) {
          return Db.models.pub.findAll({ where: args });
        }
      },
      monuments: {
        type: new GraphQLList(Monument),
        resolve (root, args) {
          return Db.models.monument.findAll({ where: args });
        }
      },
    };
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutations',
  description: 'Mutation object',
  fields () {
    return {
      addCountry: {
        type: Country,
        args: {
          countryName: {
            type: new GraphQLNonNull(GraphQLString)
          },
          countryCode: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve (source, args) {
          return Db.models.country.create({
            countryName: args.countryName,
            countryCode: args.countryCode
          });
        }
      }
    };
  }
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

export default Schema;
