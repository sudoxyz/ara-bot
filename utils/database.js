const Sequelize = require('sequelize');
const { Users, Stats } = require('./dbObjects.js');

const setup = () => {
  const sequelize = new Sequelize({
    dialect: 'mysql',
    // logging: false,
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
  });

  sequelize
    .sync({ force: true })
    .then(async () => {
      console.log('Finished Database Init!');
      sequelize.close();
    })
    .catch(console.error);
};

const reflect = async (client, db) => {
  Reflect.defineProperty(client.dbstats, 'addStats', {
    value: async function addStats(stats, statType) {
      const newStats = await Stats.create().catch(console.error);
      await stats.forEach((k, v) => {
        if (k == undefined) {
          k = 0;
        }
        newStats[v] = k;
      });
      newStats.type = statType;
      newStats.save();
      return newStats.id;
    },
  });
  Reflect.defineProperty(client.dbstats, 'deleteStats', {
    value: async function deleteStats(id) {
      return await db.query(`delete from stats where id = ${id}`);
    },
  });
  Reflect.defineProperty(client.dbstats, 'updateStats', {
    value: async function updateStats(id, stats) {
      const newStats = await Stats.findByPk(id);
      console.log(newStats);
      await stats.forEach((k, v) => {
        console.log(`key ${k} value ${v}`);
        if (k == undefined) {
          k = 0;
        }
        newStats[v] = k;
      });
      newStats.save();
    },
  });
  Reflect.defineProperty(client.dbstats, 'countStats', {
    value: async function countStats(stat) {
      const stats = await db.query(`select SUM(${stat}) from stats`);
      console.log(stats[0][0][`SUM(${stat})`]);
      return stats[0][0][`SUM(${stat})`];
    },
  });
  Reflect.defineProperty(client.dbstats, 'countStatsByType', {
    value: async function countStatsByType(type) {
      let stats;
      if (type.toString() === 'all') {
        stats =
          await db.query(`select SUM(seriouslyConsidered) as seriouslyConsidered, SUM(saidTheyWentVegan) as saidTheyWentVegan,
                SUM(concededAntiVeganPosition) as concededAntiVeganPosition, SUM(thankedYou) as thankedYou, 
                SUM(wouldWatchDocumentary) as wouldWatchDocumentary, SUM(changedPerspective) as changedPerspective from stats`);
      } else {
        stats =
          await db.query(`select SUM(seriouslyConsidered) as seriouslyConsidered, SUM(saidTheyWentVegan) as saidTheyWentVegan,
                SUM(concededAntiVeganPosition) as concededAntiVeganPosition, SUM(thankedYou) as thankedYou, 
                SUM(wouldWatchDocumentary) as wouldWatchDocumentary, SUM(changedPerspective) as changedPerspective from stats where type = '${type}'`);
      }
      return stats[0][0];
    },
  });
  Reflect.defineProperty(client.dbusers, 'addXp', {
    /* eslint-disable-next-line func-name-matching */
    value: async function addXp(id, amount) {
      let user = client.dbusers.get(id);
      if (user) {
        user.xp += Number(amount);
        return user.save();
      }
      user = await client.dbusers.addUser(id);
      user.xp = amount;
      return user.save();
    },
  });
  Reflect.defineProperty(client.dbusers, 'addBalance', {
    /* eslint-disable-next-line func-name-matching */
    value: async function addBalance(id, amount) {
      let user = client.dbusers.get(id);
      if (user) {
        user.balance = (user.balance || 0) + (Number(amount) || 0);
        return user.save();
      }
      user = await client.dbusers.addUser(id);
      user.balance = amount;
      return user.save();
    },
  });
  Reflect.defineProperty(client.dbusers, 'updateMuted', {
    /* eslint-disable-next-line func-name-matching */
    value: async function updateMuted(id, status) {
      let user = client.dbusers.get(id);
      if (user) {
        user.muted = status;
        return user.save();
      }
      user = await client.dbusers.addUser(id);
      user.muted = status;
      return user.save();
    },
  });
  Reflect.defineProperty(client.dbusers, 'updateRestricted', {
    /* eslint-disable-next-line func-name-matching */
    value: async function updateRestricted(id, status) {
      let user = client.dbusers.get(id);
      if (user) {
        user.restricted = status;
        return user.save();
      }
      user = await client.dbusers.addUser(id);
      if (user) {
        user.restricted = status;
        return user.save();
      }
    },
  });
  Reflect.defineProperty(client.dbusers, 'updateRestricted2', {
    /* eslint-disable-next-line func-name-matching */
    value: async function updateRestricted2(id, status) {
      let user = client.dbusers.get(id);
      if (user) {
        user.restricted2 = status;
        return user.save();
      }
      user = await client.dbusers.addUser(id);
      if (user) {
        user.restricted2 = status;
        return user.save();
      }
    },
  });
  Reflect.defineProperty(client.dbusers, 'updateRestricted3', {
    /* eslint-disable-next-line func-name-matching */
    value: async function updateRestricted3(id, status) {
      let user = client.dbusers.get(id);
      if (user) {
        user.restricted3 = status;
        return user.save();
      }
      user = await client.dbusers.addUser(id);
      if (user) {
        user.restricted3 = status;
        return user.save();
      }
    },
  });
  Reflect.defineProperty(client.dbusers, 'updateRestricted4', {
    /* eslint-disable-next-line func-name-matching */
    value: async function updateRestricted4(id, status) {
      let user = client.dbusers.get(id);
      if (user) {
        user.restricted4 = status;
        return user.save();
      }
      user = await client.dbusers.addUser(id);
      if (user) {
        user.restricted4 = status;
        return user.save();
      }
    },
  });
  Reflect.defineProperty(client.dbusers, 'setLastJoinedVC', {
    value: async function setLastJoinedVC(id, timestamp) {
      let user = client.dbusers.get(id);
      if (user) {
        user.lastJoinedVC = timestamp;
        return user.save();
      }
      user = await client.dbusers.addUser(id);
      if (user) {
        user.lastJoinedVC = timestamp;
        return user.save();
      }
    },
  });
  Reflect.defineProperty(client.dbusers, 'setLastLeftVC', {
    value: async function setLastLeftVC(id, timestamp) {
      let user = client.dbusers.get(id);
      if (user) {
        user.lastLeftVC = timestamp;
        return user.save();
      }
      user = await client.dbusers.addUser(id);
      if (user) {
        user.lastLeftVC = timestamp;
        return user.save();
      }
    },
  });
  Reflect.defineProperty(client.dbusers, 'getLastLeftVC', {
    value: async function getLastLeftVC(id) {
      const user = client.dbusers.get(id);
      return user ? user.lastLeftVC : 0;
    },
  });
  Reflect.defineProperty(client.dbusers, 'getLastJoinedVC', {
    value: async function getLastJoinedVC(id) {
      const user = client.dbusers.get(id);
      return user ? user.lastJoinedVC : 0;
    },
  });
  Reflect.defineProperty(client.dbusers, 'xpnextstage', {
    value: function getXpToNextLevel(level) {
      const xpToNextLevel = (level + 1) ** 3 * 250 + 100;
      return xpToNextLevel;
    },
  });
  Reflect.defineProperty(client.dbusers, 'getHighestLevel', {
    value: function getHighestLevel(xp) {
      const HighestLevel = Math.max(0, Math.floor(Math.cbrt((xp - 100) / 250)));
      return HighestLevel;
    },
  });
  Reflect.defineProperty(client.dbusers, 'getBalance', {
    /* eslint-disable-next-line func-name-matching */
    value: function getBalance(id) {
      const user = client.dbusers.get(id.toString());
      return user ? user.balance : 0;
    },
  });
  Reflect.defineProperty(client.dbusers, 'getMuted', {
    /* eslint-disable-next-line func-name-matching */
    value: function getMuted(id) {
      const user = client.dbusers.get(id.toString());
      return user ? user.muted : 0;
    },
  });
  Reflect.defineProperty(client.dbusers, 'getRestricted', {
    /* eslint-disable-next-line func-name-matching */
    value: function getRestricted(id) {
      const user = client.dbusers.get(id.toString());
      return user ? user.restricted : 0;
    },
  });
  Reflect.defineProperty(client.dbusers, 'getRestrictedTwo', {
    /* eslint-disable-next-line func-name-matching */
    value: function getRestrictedTwo(id) {
      const user = client.dbusers.get(id.toString());
      return user ? user.restricted2 : 0;
    },
  });
  Reflect.defineProperty(client.dbusers, 'getRestrictedThree', {
    /* eslint-disable-next-line func-name-matching */
    value: function getRestrictedThree(id) {
      const user = client.dbusers.get(id.toString());
      return user ? user.restricted3 : 0;
    },
  });
  Reflect.defineProperty(client.dbusers, 'getRestrictedFour', {
    /* eslint-disable-next-line func-name-matching */
    value: function getRestrictedFour(id) {
      const user = client.dbusers.get(id.toString());
      return user ? user.restricted4 : 0;
    },
  });
  Reflect.defineProperty(client.dbusers, 'getLeaderboard', {
    value: async function getLeaderboard(amount, searchfor) {
      const leaderboard = await db.query(
        `SELECT user_id, ${searchfor} FROM users ORDER BY ${searchfor} DESC LIMIT ${amount}`,
      );
      // console.log(leaderboard);
      return leaderboard[0];
    },
  });
  Reflect.defineProperty(client.dbusers, 'getLeaderboardRank', {
    value: async function getLeaderboardRank(id, searchfor) {
      const Rank = await db.query(
        `select count(*) from users where ${searchfor} >= (select ${searchfor} from users where user_id = ${id})`,
      );
      return Rank[0][0]['count(*)'];
    },
  });
  Reflect.defineProperty(client.dbusers, 'getAllUsersAppliedForRole', {
    value: async function getAllUsersAppliedForRole(role) {
      const results = await db.query(
        `select user_id from users where ${role} = true`,
      );
      return results[0];
    },
  });
  Reflect.defineProperty(client.dbusers, 'addUser', {
    /* eslint-disable-next-line func-name-matching */
    value: async function addUser(id) {
      const user = client.dbusers.get(id);
      if (user) {
        return user;
      }
      const newUser = await Users.create({ user_id: id }).catch(console.error);
      await client.dbusers.set(id, newUser);
      if (newUser) {
        newUser.save();
      }
      return newUser;
    },
  });
  Reflect.defineProperty(client.dbusers, 'setApplication', {
    /* eslint-disable-next-line func-name-matching */
    value: async function setApplication(id, role) {
      let user = client.dbusers.get(id);
      if (user) {
        if (user[role.toString()] === true) {
          return true;
        }
        user[role.toString()] = true;
        user.save();
        return false;
      }
      user = await client.dbusers.addUser(id);
      user.role = true;
      user.save();
      return false;
    },
  });
  Reflect.defineProperty(client.dbusers, 'getAllRolesAppliedFor', {
    /* eslint-disable-next-line func-name-matching */
    value: async function getAllRolesAppliedFor(id) {
      const user = client.dbusers.get(id);
      if (user) {
        const results =
          await db.query(`select moderator, b12, debater, verifier, vegsupport, mediateam, arateam,
             outreachleader, humanrights, voidaccess from users where user_id = ${id}`);
        return results[0][0];
      }
    },
  });
  Reflect.defineProperty(client.dbusers, 'removeApplication', {
    /* eslint-disable-next-line func-name-matching */
    value: async function removeApplication(id, role) {
      let user = client.dbusers.get(id);
      if (user) {
        if (user[role.toString()] === false) {
          return true;
        }
        user[role.toString()] = false;
        user.save();
        return false;
      }
      user = await client.dbusers.addUser(id);
      user.role = false;
      user.save();
      return user;
    },
  });
  Reflect.defineProperty(client.dbusers, 'getUser', {
    /* eslint-disable-next-line func-name-matching */
    value: function getUser(id) {
      const user = client.dbusers.get(id);
      if (user) {
        return user;
      }
      return client.dbusers.addUser(id);
    },
  });
};
module.exports = { reflect, setup };
