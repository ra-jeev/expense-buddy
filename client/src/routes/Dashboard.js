import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle } from 'react-icons/fa';
import { BSON } from 'realm-web';

import { useRealmApp } from '../RealmApp';
import { formatDateTime, formatCurrency } from '../utils';
import AddImage from '../assets/images/add-notes.svg';

export const Dashboard = () => {
  const [user, setUser] = useState();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { realmUser, appDB } = useRealmApp();

  useEffect(() => {
    const getUser = async () => {
      const res = await appDB
        .collection('users')
        .findOne({ _id: new BSON.ObjectId(realmUser.id) });
      console.log('got some user', res);
      setUser(res);
    };

    const getTransactions = async () => {
      const date = new Date();
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      const res = await appDB.collection('transactions').find(
        {
          createdAt: { $gte: date, $lte: new Date() },
        },
        {
          sort: {
            createdAt: -1,
          },
        }
      );
      console.log('got transactions res', res);
      setTransactions(res);
      setLoading(false);
    };

    if (appDB) {
      getUser();
      getTransactions();
    }
  }, [appDB, realmUser]);

  return (
    <div className='container'>
      {loading ? (
        <div className='loader'>Loading...</div>
      ) : transactions.length ? (
        <div className='dashboard'>
          {user && (
            <div className='card summary-card'>
              <h2>This month</h2>

              <div className='details'>
                <div>Current Balance</div>
                <div className='details-value'>
                  {formatCurrency(user.balance)}
                </div>
              </div>

              <div className='card-row'>
                <div className='details money-in'>
                  <div className='details-label'>Total money in</div>
                  <div className='details-value'>
                    {formatCurrency(user.currMonth.in)}
                  </div>
                </div>
                <div className='details money-out'>
                  <div className='details-label'>Total money out</div>
                  <div className='details-value'>
                    {formatCurrency(user.currMonth.out)}
                  </div>
                </div>
              </div>
            </div>
          )}

          <h3 className='transactions-title'>Transactions</h3>

          {transactions.map((transaction) => {
            return (
              <div
                key={transaction._id}
                className={`card transaction-card ${
                  transaction.type === 'IN'
                    ? 'transaction-in'
                    : 'transaction-out'
                }`}
              >
                <div>
                  <div>{transaction.comment}</div>
                  <div className='transaction-date'>
                    {formatDateTime(transaction.createdAt)}
                  </div>
                </div>
                <div className='transaction-value'>
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className='no-data'>
          <img
            className='no-data-img'
            src={AddImage}
            alt='No transactions found, add one'
          />
          <div className='no-data-text'>No transactions found</div>
          <button
            type='button'
            className='btn btn-primary'
            onClick={() => navigate('/new')}
          >
            <FaPlusCircle /> Add Transaction
          </button>
        </div>
      )}
    </div>
  );
};
