exports = async function () {
  console.log('context.user.type:', context.user.type)
  const usersCollection = context.services
    .get('mongodb-atlas')
    .db('buddyDB')
    .collection('users');

  const users = await usersCollection.find({
    "$or": [
      { "currMonth.in": { "$gt": 0 } },
      { "currMonth.out": { "$gt": 0 } }
    ]
  }).toArray();

  console.log(`find op users: ${JSON.stringify(users)}`);
  const bulkOps = [];
  for (const user of users) {
    bulkOps.push({
      updateOne: {
        filter: { _id: user._id },
        update: {
          $set: {
            updatedAt: new Date(),
            'currMonth.in': 0,
            'currMonth.out': 0,
          },
        },
      },
    });
  }

  if (bulkOps.length) {
    await usersCollection.bulkWrite(bulkOps);
    console.log('after the bulk write ops')
  }
  
  
};
