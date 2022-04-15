import './Menu.css';
import {useState} from "react";


const Menu=({onClick}) =>
{

    const [list_name, setList_name]=useState('To do list');
    const handleTitleChange = (tit)=>{
        onClick(tit);
    }

    //Эта функция отвечает за разворачивание меню, если оно нажимаетсяи класса open у div нет, то добавляет и наоборот
    function ChoiceItem() {
        let menuElem = document.getElementById('nav');
        let titleElem = menuElem.querySelector('.title');

        menuElem.onclick = function () {
            menuElem.classList.toggle('open');
        };
    }

    //Меняет заголовок, наверное можно объекдинить это в одно, но вот так
    function ChoiceTitle(title)
    {
        setList_name(title); //Это вызывается чтобы у нашего  <p>{list_name}</p> поменялся заголовок
        handleTitleChange(title); //Это чтобы передать родительскому компоненту наш выбор, а родительский(App) уже передает это в компонент Body
    }

        return (
            <div>
                <div className='wrapper'>
                    <p>{list_name}</p>
                    <div id='nav' className='menu' onClick={(e) => ChoiceItem(e)}>
                       {/* <span className="title">...</span>*/}
                       { <ul>
                            <li className='line' onClick={(e) => ChoiceTitle('Completed list')}>Completed</li>
                            <li className='line' onClick={(e) => ChoiceTitle('To do list')}>In progress</li>
                            <li onClick={(e) => ChoiceTitle('Removed list')}>Removed</li>
                        </ul>}
                    </div>
                </div>
            </div>
        );

}

export default Menu;