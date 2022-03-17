import './App.css';
import moment from "moment"
import * as fcl from "@onflow/fcl";
import * as types from "@onflow/types";
import {useState, useEffect} from 'react';
import { script} from "./cadence/code.js";




fcl.config()
  .put("accessNode.api", "https://access-mainnet-beta.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/authn")

function App() {
  const [user, setUser] = useState();

  const [scriptResult, setScriptResult] = useState([]);


  useEffect(() => {
    fcl.currentUser().subscribe(setUser);
  }, [])

  const logIn = () => {
    fcl.authenticate();
  }

  const logOut = () => {
    fcl.unauthenticate();
  }

  const view = async () => {
    console.log(user.addr);
    console.log(Date.now().toFixed(1));

    const result = await fcl.send([
      fcl.script(script),
      fcl.args([ 
        fcl.arg(user.addr.toString() , types.Address)
      ])
    ]).then(fcl.decode);

    console.log(result);
    setScriptResult(result);

  }

  const fixDate = (timestamp) => {
    return moment.unix(timestamp).format('L'); ;
  };



  return (
    <div className="App">
      <div>
        <h2>BLT Unlock Check</h2>

      </div>
      <div>
        <button onClick={() => logIn()}>Log In</button>
        <button onClick={() => logOut()}>Log Out</button>
      </div>

      {user && user.addr ? 
      <div>
        <h1>{user.addr}</h1> 
        <div>
          <button onClick={() => view()}>Check BLT unlock info</button>
          {scriptResult.length !== 0
          ? <div>
              <h2>Next Unlocking Date : {fixDate(scriptResult[0])}</h2>
              <h2>BLT Amount : {scriptResult[1]} BLT</h2>

            </div>
            
          : null
        }
        </div>
      </div>
      : null }





   
    </div>
  );
}

export default App;