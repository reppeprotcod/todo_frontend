import './Body.css';
import {useState} from "react";
import { text } from '@fortawesome/fontawesome-svg-core';

const apiUrl = window.app && window.app.env.API_URL;
var tasks_in_progress = [];
var tasks_completed=[];
var tasks_removed=[];


const Body=({active, onChange}) => {
    const [list_tasks, SetTasks_in_progress] = useState(tasks_in_progress);

    useState(() => {
        getTasksFromDb();
        getTasksFromDb('del');
        getTasksFromDb('compl');
    });

    const handleTaskCountChange = (count)=>{
        onChange(count);
    }

    // ПОЛУЧЕНИЕ СПИСКА ЗАДАЧ "In progress"
    // ИЗ БАЗЫ ДАННЫХ ЧЕРЕЗ ЗАПРОС К API
    function getTasksFromDb(type) {
        let funcName = 'getCurrentTasks';
        if (type === 'del') funcName = 'getDelTasks';
        else if (type === 'compl') funcName = 'getComplTask';

        fetch(`${apiUrl}/${funcName}.php`, {
            credentials: 'same-origin'
        })
        .then(resp => resp.json())
        .then(resp => {
            // ВЫБОР МАССИВА ДЛЯ ИЗМЕНЕНИЯ
            let arr = tasks_in_progress;
            if (type === 'del') arr = tasks_removed;
            else if (type === 'compl') arr = tasks_completed;
            arr.splice(0, arr.length);
            // ДОБАВЛЕНИЕ ЗАДАЧ
            resp.forEach(item => {
                arr.push({
                    id: item.id,
                    task: item.text
                });
            });
            handleClick();
        });
    }

    //ДОБАВЛЯЕМ ЗНАЧЕНИЕ В ЛИСТ ЗАДАЧ В ПРОЦЕССЕ
    function addItem()
    {
        let inpTsk = prompt ('What is your main focus for today?','Don\'t die');
        if(inpTsk == null || inpTsk == ""){
            return;
        }
        
        // ЗАПРОС К API ДЛЯ ДОБАВЛЕНИЯ ЗАДАЧИ В БАЗУ ДАННЫХ
        let data = new FormData();
        data.append('text', inpTsk);
        fetch(`${apiUrl}/createTask.php`, {
            credentials: 'same-origin',
            method: "POST",
            body: data
        }).then(() => {
            getTasksFromDb();
        });
    }

    //ФУНКЦИЯ, КОТОРАЯ ВЫЗЫВАЕТ ИЗМЕНЕНИЕ СОСТОЯНИЯ МАССИВА,
    // КОГДА СОСТОЯНИЕ ИЗМЕНЯЕТСЯ, ЧТО-ТО УДАЛЯЕТСЯ ИЗ МАССИВА ИЛИ ДОБАВЛЯЕТСЯ,
    // ТО НАШ КОМПОНЕНТ ЗАНОВО ПЕРЕРЕСОВЫВАЕТСЯ
    function handleClick ()  {
         SetTasks_in_progress(state => {
            return {
                tasks_in_progress
            };
        });
    };


    //ЭТА РАЗМЕТКА ВОЗВРАЩАЕТ МАССИВ ЗАДАНИЙ,
    // КОТОРЫЕ НУЖНО ВЫПОЛНИТЬ, МАССИВ IN PROGRESS
    if (active=='To do list') {
        handleTaskCountChange(tasks_in_progress.length);
        return (
            <div className='body'>
                {(tasks_in_progress || []).map((item, index) => (
                    <div className='itemTsk' key={index}>
                        <span onClick={(e) => doneTask(index, e)} className='ElipseIn'/>
                        <span className='taskTitle'>{item.task}</span>
                        <span onClick={(e) => removeTask(index, e)} className='removeItem'><span>&#10006;</span></span>
                    </div>
                ))}
                <input type="button" className='AddBtn' onClick={(e) => addItem()} value='+'/>
            </div>
        );
    }

    //ЭТА РАЗМЕТКА ВОЗВРАЩАЕТ МАССИВ ЗАДАНИЙ,
    // КОТОРЫЕ ЗАВЕРШЕНЫ, МАССИВ COMPLETED
    //НУЖНО ДОБАВИТЬ СТИЛИ НА ЭТУ РАЗМЕТКУ КАК В ДИЗАЙНЕ, ЗАЧЕРКНУТЫЕ ПОЛОСКИ И ВСЕ ТАКОЕ
    else if(active=='Completed list')
    {
        handleTaskCountChange(tasks_completed.length);
        return(
            <div className='body'>
                {(tasks_completed || []).map((item, index) => (
                    <div className='itemTskCompl' key={index}>
                        <span onClick={(e) => undoneTask(index, e)} className='ElipseInCompl'>✓</span>
                        <span className='taskTitle'>{item.task}</span>
                    </div>
                ))}
            {/*<input type="button" className='AddBtn' onClick={(e) => addItem()} value='+'/>*/}
            </div>
        )
    }

    //ЭТА РАЗМЕТКА ВОЗВРАЩАЕТ МАССИВ ЗАДАНИЙ,
    // КОТОРЫЕ НУЖНО УДАЛЕНЫ, МАССИВ REMOVED
    //ТАМ ВРОДЕ НЕТ СТИЛЕЙ ДЛЯ УДАЛЕННЫХ ЗАПИСЕЙ, НО МОЖНО ЧЕ-ТО СВОЕ ПРИДУМАТЬ
    else if(active=='Removed list')
    {
        handleTaskCountChange(tasks_removed.length);
        return(
            <div className='body'>
                {(tasks_removed || []).map((item, index) => (
                    <div className='itemTskCompl' key={index}>
                        <span className='taskTitleDel'>{item.task}</span>
                        <span onClick={(e) => restoreTask(index, e)} className='restoreItem'><span>&#8635;</span></span>
                        <span onClick={(e) => deleteTask(index, e)} className='restoreItem delete'><span>&#10006;</span></span>
                    </div>
                ))}
                {/*  <input type="button" className='AddBtn' onClick={(e) => addItem()} value='✓'/>*/}
            </div>
        )
    }

    //ФУНКЦИЯ, КОТОРАЯ УДАЛЯЕТ ЗАДАНИЕ ИЗ СПИСКА В ПРОГРЕССЕ
    // И ДОБАВЛЯЕТ ЕГО В СПИСОК ЗАВЕРШЕННЫХ
    function doneTask(item) {
        // ЗАПРОС К API ДЛЯ ПЕРЕМЕЩЕНИЯ ЗАДАЧИ
        // С ЗАДАННЫМ ID ИЗ СПИСКА ТЕКУЩИХ ЗАДАЧ
        // В СПИСОК ВЫПОЛНЕННЫХ ЗАДАЧ
        let data = new FormData();
        data.append('id', tasks_in_progress[item].id);
        fetch(`${apiUrl}/putInCompl.php`, {
            credentials: 'same-origin',
            method: 'post',
            body: data
        }).then(() => {
            getTasksFromDb('');
            getTasksFromDb('compl');
        });
    }

    //ФУНКЦИЯ, КОТОРАЯ УДАЛЯЕТ ЗАДАНИЕ ИЗ СПИСКА В ПРОГРЕССЕ
    // И ДОБАВЛЯЕТ ЕГО В СПИСОК УДАЛЕННЫХ
    function removeTask(item){
        // ЗАПРОС К API ДЛЯ ПЕРЕМЕЩЕНИЯ ЗАДАЧИ
        // С ЗАДАННЫМ ID ИЗ СПИСКА ТЕКУЩИХ ЗАДАЧ
        // В СПИСОК УДАЛЕННЫХ ЗАДАЧ
        let data = new FormData();
        data.append('id', tasks_in_progress[item].id);
        fetch(`${apiUrl}/putInDel.php`, {
            credentials: 'same-origin',
            method: 'post',
            body: data
        }).then(() => {
            getTasksFromDb('');
            getTasksFromDb('del');
        });
    }

    function undoneTask(item){
        // ЗАПРОС К API ДЛЯ ПЕРЕМЕЩЕНИЯ ЗАДАЧИ
        // С ЗАДАННЫМ ID ИЗ СПИСКА ВЫПОЛНЕННЫХ ЗАДАЧ
        // В СПИСОК ТЕКУЩИХ ЗАДАЧ
        let data = new FormData();
        data.append('id', tasks_completed[item].id);
        fetch(`${apiUrl}/putInCurrent.php`, {
            credentials: 'same-origin',
            method: 'post',
            body: data
        }).then(() => {
            getTasksFromDb('');
            getTasksFromDb('compl');
        });
    }

    function restoreTask(item){
        // ЗАПРОС К API ДЛЯ ПЕРЕМЕЩЕНИЯ ЗАДАЧИ
        // С ЗАДАННЫМ ID ИЗ СПИСКА УДАЛЕННЫХ ЗАДАЧ
        // В СПИСОК ТЕКУЩИХ ЗАДАЧ
        let data = new FormData();
        data.append('id', tasks_removed[item].id);
        fetch(`${apiUrl}/putInCurrent.php`, {
            credentials: 'same-origin',
            method: 'post',
            body: data
        }).then(() => {
            getTasksFromDb();
            getTasksFromDb('del');
        });
    }

    function deleteTask(item){
        // ЗАПРОС К API ДЛЯ УДАЛЕНИЯ ЗАДАЧИ
        // С ЗАДАННЫМ ID ИЗ СПИСКА УДАЛЕННЫХ ЗАДАЧ
        let data = new FormData();
        data.append('id', tasks_removed[item].id);
        fetch(`${apiUrl}/delete.php`, {
            credentials: 'same-origin',
            method: 'post',
            body: data
        }).then(() => {
            getTasksFromDb('del');
        });
    }
}

export default Body;
