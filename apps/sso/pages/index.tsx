import 'bootstrap/dist/css/bootstrap.css'
import styles from '../styles/Home.module.css'
import Link from 'next/Link'
import { useState } from 'react'; 

export default function Home() {
  const [login, setLogin] = useState(true)
  const [role, setRole] = useState("fan")

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        { login ? <h1 className={styles.title}>Login</h1> : <h1 className={styles.title}>Sign up</h1> }
        
        <div className="btn-group" role="group">
          <button className="btn btn-primary" onClick={() => setRole("fan")}>Fan</button>
          <button className="btn btn-primary" onClick={() => setRole("organizer")}>Organizer</button>
        </div>

        <div className={styles.grid}>
          <div className="d-grid gap-3">
            { role === "fan" ? 
              <Link href={`/phone`}>
                <div className="btn btn-primary">
                  Continue with Phone
                </div>
              </Link> : null 
            }
            <Link href={`/email`}>
              <div className="btn btn-primary">
                Continue with Email
              </div>
            </Link>
            <button className="btn btn-primary" type="button">Continue with Google</button>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        { login ? 
          (<div>Can't login? <div className="btn btn-primary" onClick={() => setLogin(!login)}>sign up</div> for new user</div>) :
          (<div>Already onboard? <div className="btn btn-primary" onClick={() => setLogin(!login)}>Log in</div></div>)
        }
      </footer>
    </div>
  )
}
