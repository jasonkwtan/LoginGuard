import './App.css'

function App() {
  return (
    <main className="shell">
      <header className="shell-header">
        <span className="wordmark">LoginGuard</span>
        <a href="https://github.com/jasonkwtan/loginguard">Source on GitHub</a>
      </header>

      <section className="intro" aria-labelledby="intro-title">
        <div className="intro-copy">
          <h1 id="intro-title">Explore how secure sign-in works.</h1>
          <p>
            LoginGuard is a learning project for browser authentication, login
            security, and bot protection with Spring Boot and React.
          </p>
        </div>
        <div className="lock-illustration" aria-hidden="true">
          <span className="lock" />
        </div>
      </section>

      <section className="focus" aria-labelledby="focus-title">
        <h2 id="focus-title">Project focus</h2>
        <dl>
          <div>
            <dt>Browser sessions</dt>
            <dd>Keep signed-in state on the server and connect it to the browser with a cookie.</dd>
          </div>
          <div>
            <dt>CSRF protection</dt>
            <dd>Protect requests that change data from being triggered by another site.</dd>
          </div>
          <div>
            <dt>Login abuse</dt>
            <dd>Explore ways to slow automated login attempts.</dd>
          </div>
        </dl>
      </section>
    </main>
  )
}

export default App
