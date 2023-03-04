exports = async function(changeEvent) {
    const doc = changeEvent.fullDocument;
    
    console.log('incoming doc:', JSON.stringify(doc));
    
    const filter = { _id: BSON.ObjectId(doc.owner_id) };
    const update = {
      $set: { updatedAt: new Date() },
      $inc: {},
    };
  
    if (doc.type === 'IN') {
      update.$inc.balance = doc.amount;
      update.$inc['currMonth.in'] = doc.amount;
    } else {
      update.$inc.balance = -doc.amount;
      update.$inc['currMonth.out'] = doc.amount;
    }
  
    const usersCollection = context.services
      .get('mongodb-atlas')
      .db('buddyDB')
      .collection('users');
    
    const res = await usersCollection.updateOne(filter, update);
    console.log('update op res:', JSON.stringify(res));
};
