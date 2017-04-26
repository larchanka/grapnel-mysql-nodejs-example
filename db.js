import Sequelize from 'sequelize';
import Faker from 'faker';
import _ from 'lodash';

// connection settings
const Conn = new Sequelize(
  'devjam', // database name
  'root', // database user
  '', // database password
  {
    dialect: 'mysql', // database type: mysql or postgresql
    host: 'localhost' // database host
  }
);

// Database schemas definitions
const Country = Conn.define('country', {
  countryName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  countryCode: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const City = Conn.define('city', {
  cityName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cityLat: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  cityLon: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }
});

const Monument = Conn.define('monument', {
  monumentName: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const Pub = Conn.define('pub', {
  pubName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  pubRating: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
});

// Database relations
Country.hasMany(City);
City.belongsTo(Country);
City.hasMany(Monument);
City.hasMany(Pub);
Monument.belongsTo(City);
Pub.belongsTo(City);

// Create tables
Conn.sync({ force: true }).then(() => {
  _.times(10, () => {
    return Country.create({
      countryName: Faker.address.country(),
      countryCode: Faker.address.countryCode()
    }).then(country => {
      return country.createCity({
        cityName: Faker.address.city(),
        cityLat: Faker.address.latitude(),
        cityLon: Faker.address.longitude()
      }).then(city => {
        return city.createMonument({
          monumentName: Faker.random.word()
        }).then(() => {
          return city.createPub({
            pubName: Faker.company.companyName(),
            pubRating: Math.floor(Math.random() * 5) + 1
          });
        });
      });
    });
  });
});

export default Conn;
