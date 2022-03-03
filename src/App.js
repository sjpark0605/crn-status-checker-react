import './App.css';
import Form from './components/Form.js'

function App() {
  return (
    <div className="App">
      <div id="title-section" className="container-fluid">
        <h1>사업자 상태 조회</h1>
      </div>
      <br />
      <Form />
    </div>
  );
}

export default App;