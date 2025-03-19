// Filename - src/App.js

import React from 'react';
import axios from 'axios';

class App extends React.Component {

    state = {
        companies : [],
    }

    componentDidMount() {

        let data ;

        axios.get('http://localhost:8000/gap/test/')
        .then(res => {
            data = res.data;
            this.setState({
                companies : data    
            });
        })
        .catch(err => {})
    }

  render() {
    return(
      <div>
            {this.state.companies.map((company, id) =>  (
            <div key={id}>
            <div >
                  <div >
                        <h1>{company.name} </h1>
                        <footer >--- had
                        {company.numAnalysis}
                        </footer>
                        <footer >--- registered on
                        {company.date}
                        </footer>
                  </div>
            </div>
            </div>
            )
        )}
      </div>
      );
  }
}

export default App;