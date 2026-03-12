import React from 'react'
import "../styles/auth.form.scss"
import { useNavigate,Link } from 'react-router';

const Register = () => {

    const navigate = useNavigate();

    const submitHandle = (e) => {
        e.preventDefault();
    }

  return (
    <main>
        <div className="form-container">
            <h1>Register</h1>
            <form onSubmit={submitHandle}>

                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" placeholder='Enter username' required/>
                </div>

                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" placeholder='Enter email address' required/>
                </div>
                
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" placeholder='Enter password' required/>
                </div>

                <button className='button primary-button'>Register</button>
            </form>

            <p>Already have an account? <Link to={"/login"}>Login</Link></p>
        </div> 
    </main>
  )
}

export default Register
