import './Footer.css';
import linkedin from '../Images/linkedin.png';

function Footer() {
    return (
        <div className='footer'>
            <h1>College Planner by Michael Menjivar</h1>
            <p>Copyright &copy; 2024 Michael Menjivar All Rights Reserved</p>
            <div className="socials">
                <p>Follow me on LinkedIn!</p>
                <a href='https://www.linkedin.com/in/michael-menjivar/' target='_blank'><img src={linkedin} alt='LinkedIn Logo'/></a>
            </div>
        </div>
    )
}

export default Footer;