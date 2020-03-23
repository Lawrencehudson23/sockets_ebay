import React,{useEffect, useState} from 'react';
import './App.css';
import io from 'socket.io-client';

function App() {
  //pass callback function react useState will only invoke the cb function  t
  //he first time  the component run it 
  const [socket] = useState(() => io(':4000'));
  const [price, setPrice] = useState(0);
  const [bids, setBids] = useState([]);
  const [inputVal, setInputVal] = useState(0);
  

  useEffect(() => {
    socket.on('welcome',data=>{
      setPrice(data.price);
      setBids(data.bids);
      setInputVal(data.price + 5);
      
    });

    socket.on('price updated', newBid => {
      setInputVal(newBid + 5);
      setPrice(newBid);
      setBids(currentBids => [...currentBids,newBid]);
      
    })

    socket.on('new user joined!',()=> {
      console.log('New user joined!')
    })
//very important in deep nested components
    return () => socket.disconnect();  //clean up
  }, [socket])
  
  function handleSubmit(event) {
    event.preventDefault();
    
    if(inputVal <= price) return;
    

    socket.emit('new bid',inputVal );
    
  }

  return (
    <div className="App">
      <p>Current Bids: {price}</p>
      <p>Bids:</p>
      <ul>
        {bids.map((bid,i) => (
          <li key={i}>{bid}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={inputVal}
          onChange={e=>setInputVal(+e.target.value)} // + make sure keep it number type
        />
        <button>Place Bid!</button>
      </form>
    </div>
  );
}

export default App;
