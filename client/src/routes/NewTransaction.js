import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRealmApp } from '../RealmApp';
const INITIAL_STATE = {
  comment: '',
  amount: '',
  type: '',
};

const TRANSACTION_TYPES = {
  SELECT: 'Select a type',
  IN: 'Add',
  OUT: 'Deduct',
};

export const NewTransaction = () => {
  const [formState, setFormState] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();
  const { appDB, realmUser } = useRealmApp();

  const setInput = (key, value) => {
    setFormState({ ...formState, [key]: value });
  };

  useEffect(() => {
    if (message) {
      const timerId = setTimeout(() => {
        if (message.type === 'success') {
          navigate('/', { replace: true });
        }
        setMessage(null);
      }, 2000);

      return () => clearTimeout(timerId);
    }
  }, [message, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const amount = parseFloat(formState.amount);
    const comment = formState.comment.trim();

    if (!amount || !comment || !formState.type) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const finalData = {
        amount,
        comment,
        type: formState.type,
        owner_id: realmUser.id,
        createdAt: new Date(),
      };

      setLoading(true);
      const res = await appDB.collection('transactions').insertOne(finalData);
      console.log('result of insert op', res);

      setFormState(INITIAL_STATE);
      setMessage({
        type: 'success',
        text: 'Successfully saved the transaction.',
      });
    } catch (error) {
      console.log('failed to save the transaction');
      setMessage({ type: 'error', text: 'Failed to save the transaction.' });
    }

    setLoading(false);
  };

  return (
    <div className='container'>
      <div className='card transaction-form'>
        <h2>Add transaction details</h2>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <label htmlFor='name'>Transaction amount</label>
            <input
              type='number'
              name='amount'
              id='amount'
              placeholder='Enter the amount'
              value={formState.amount}
              onChange={(e) => setInput('amount', e.target.value)}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='comment'>Transaction comment</label>
            <input
              type='text'
              name='comment'
              id='comment'
              placeholder='Transaction comment'
              value={formState.comment}
              onChange={(e) => setInput('comment', e.target.value)}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='transaction-type'>Transaction type</label>
            <select
              name='transaction-type'
              id='transaction-type'
              value={formState.type}
              onChange={(e) => setInput('type', e.target.value)}
            >
              {Object.keys(TRANSACTION_TYPES).map((type) => {
                return (
                  <option key={`type-${type}`} value={type}>
                    {TRANSACTION_TYPES[type]}
                  </option>
                );
              })}
            </select>
          </div>

          {message && (
            <div className={`message-${message.type}`}>{message.text}</div>
          )}

          <div className='card-row'>
            <button
              className='btn btn-outlined'
              disabled={loading}
              type='button'
              onClick={() => setFormState(INITIAL_STATE)}
            >
              Cancel
            </button>
            <button
              className='btn btn-primary'
              disabled={loading}
              type='submit'
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
