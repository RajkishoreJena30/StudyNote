
import './App.css'
import AddNewPostContainer from './components/AddNewPostContainer'
import Posts from './components/Posts'

function App() {


  return (
    <>
      <h3>Redux Toolkit Practice</h3>
       <div className='post-parent-container'>
         <Posts/>
         <AddNewPostContainer/>
       </div>
    </>
  )
}

export default App
