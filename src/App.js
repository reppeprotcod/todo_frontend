import './App.css';
import Header from "./Header/Header";
import Body from "./Body/Body";
import Menu from "./Menu/Menu"
import {useState} from "react";


function App() {
    //Мы отслеживаем через событие handleTitleChange смену заголовка в меню
    // и передаем его в компонент  Body active={active_list}, при начальной загрузке веб-приложения он в таком состоянии useState('To do list');
    const [active_list, setActive_list]=useState('To do list');
    const handleTitleChange = (active_list)=>{
        setActive_list(active_list);
    }

    //Мы отслеживаем через событие  handleTaskCountChange смену количества заданий в боди
    // и передаем его в компонент  Header
    const [count_task, setCount]=useState();
    const handleTaskCountChange = (count_task) =>{
        setCount(count_task);
    }

  return (
    <div className="wrapApp">
      <div className="App">
      <Header count_tasks={count_task}/>
      <Menu classNeme='menu' onClick={handleTitleChange}/>
      <Body className='body' onChange={handleTaskCountChange} active={active_list}/>
      </div>
    </div>

  );
}

export default App;
