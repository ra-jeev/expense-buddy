exports = async function(authEvent) {
  const { user, time } = authEvent;

  const mongoDb = context.services.get('mongodb-atlas').db('buddyDB');
  const usersCollection = mongoDb.collection('users');

  const userData = {
    _id: BSON.ObjectId(user.id),
    balance: 0,
    currMonth: {
      in: 0,
      out: 0,
    },
    createdAt: time, 
    updatedAt: time,
  };

  const res = await usersCollection.insertOne(userData);
  console.log('result of user insert op: ', JSON.stringify(res));
};
