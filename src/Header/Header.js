import './Header.css';

var weeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

var today = new Date();
var tDate = {
    week: weeks[today.getDay()],
    month: months[today.getMonth()],
    day: today.getDate()+'',
    year: today.getFullYear()+''
};

function Header(props) {
    return (
        <div className="Header"><div className='Date'>{tDate.week}, {tDate.month} {tDate.day}, {tDate.year}</div><hr className='Line'/>
        <span className='TasksCount'>{props.count_tasks} tasks</span></div>
    );
}
export default Header;
